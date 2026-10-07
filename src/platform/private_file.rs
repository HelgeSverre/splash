//! Owner-only server credentials and locks. Validate the opened object, not a
//! separate pathname, and never follow a token symlink/reparse point.
use std::{fs::File, io, path::Path};

#[cfg(unix)]
pub fn open(path: &Path, create_new: bool) -> io::Result<File> {
    use std::os::unix::fs::{OpenOptionsExt, PermissionsExt};
    let file = std::fs::OpenOptions::new()
        .read(true)
        .write(true)
        .create(!create_new)
        .create_new(create_new)
        .truncate(false)
        .mode(0o600)
        .custom_flags(libc::O_NOFOLLOW)
        .open(path)?;
    let meta = file.metadata()?;
    if !meta.is_file() || meta.permissions().mode() & 0o077 != 0 {
        return Err(io::Error::new(
            io::ErrorKind::PermissionDenied,
            "Server files must be regular owner-only files (chmod 600)",
        ));
    }
    Ok(file)
}

#[cfg(windows)]
pub fn open(path: &Path, create_new: bool) -> io::Result<File> {
    use std::os::windows::{
        ffi::OsStrExt,
        fs::MetadataExt,
        io::{AsRawHandle, FromRawHandle},
    };
    use windows_sys::Win32::{
        Foundation::*,
        Security::{Authorization::*, *},
        Storage::FileSystem::*,
    };
    // Protected DACL: only the file owner has access; no inherited Users grants.
    const DACL: &str = "D:P(A;;FA;;;OW)";
    let wide: Vec<u16> = path.as_os_str().encode_wide().chain(Some(0)).collect();
    let sddl: Vec<u16> = DACL.encode_utf16().chain(Some(0)).collect();
    // SAFETY: Win32 output allocations are freed with LocalFree, the returned
    // file handle transfers exactly once into File. All buffers are NUL terminated.
    unsafe {
        let mut descriptor = std::ptr::null_mut();
        if ConvertStringSecurityDescriptorToSecurityDescriptorW(
            sddl.as_ptr(),
            SDDL_REVISION_1,
            &mut descriptor,
            std::ptr::null_mut(),
        ) == 0
        {
            return Err(io::Error::last_os_error());
        }
        let attributes = SECURITY_ATTRIBUTES {
            nLength: std::mem::size_of::<SECURITY_ATTRIBUTES>() as u32,
            lpSecurityDescriptor: descriptor,
            bInheritHandle: 0,
        };
        let handle = CreateFileW(
            wide.as_ptr(),
            GENERIC_READ | GENERIC_WRITE | READ_CONTROL,
            FILE_SHARE_READ | FILE_SHARE_WRITE,
            &attributes,
            if create_new { CREATE_NEW } else { OPEN_ALWAYS },
            FILE_ATTRIBUTE_NORMAL | FILE_FLAG_OPEN_REPARSE_POINT,
            std::ptr::null_mut(),
        );
        let error = io::Error::last_os_error();
        LocalFree(descriptor);
        if handle == INVALID_HANDLE_VALUE {
            return Err(error);
        }
        let file = File::from_raw_handle(handle);
        let meta = file.metadata()?;
        if !meta.is_file() || meta.file_attributes() & FILE_ATTRIBUTE_REPARSE_POINT != 0 {
            return Err(io::Error::new(
                io::ErrorKind::PermissionDenied,
                "Server files cannot be directories or reparse points",
            ));
        }
        let mut actual = std::ptr::null_mut();
        let result = GetSecurityInfo(
            file.as_raw_handle(),
            SE_FILE_OBJECT,
            DACL_SECURITY_INFORMATION,
            std::ptr::null_mut(),
            std::ptr::null_mut(),
            std::ptr::null_mut(),
            std::ptr::null_mut(),
            &mut actual,
        );
        if result != 0 {
            return Err(io::Error::from_raw_os_error(result as i32));
        }
        let mut text = std::ptr::null_mut();
        let mut length = 0;
        let converted = ConvertSecurityDescriptorToStringSecurityDescriptorW(
            actual,
            SDDL_REVISION_1,
            DACL_SECURITY_INFORMATION,
            &mut text,
            &mut length,
        );
        let error = io::Error::last_os_error();
        LocalFree(actual);
        if converted == 0 {
            return Err(error);
        }
        let value = String::from_utf16_lossy(std::slice::from_raw_parts(
            text,
            length.saturating_sub(1) as usize,
        ));
        LocalFree(text.cast());
        if value != DACL {
            return Err(io::Error::new(io::ErrorKind::PermissionDenied, "Server file DACL is not owner-only; move the old file aside and restart to generate a private one"));
        }
        Ok(file)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn private_files_reopen_and_reject_unprotected_existing_files() {
        let dir = std::env::temp_dir().join(crate::store::new_id("private-files"));
        std::fs::create_dir(&dir).unwrap();
        let private = dir.join("private");
        drop(open(&private, true).unwrap());
        drop(open(&private, false).unwrap());
        let public = dir.join("public");
        std::fs::write(&public, "not a private credential").unwrap();
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            std::fs::set_permissions(&public, std::fs::Permissions::from_mode(0o644)).unwrap();
            let link = dir.join("link");
            std::os::unix::fs::symlink(&private, &link).unwrap();
            assert!(open(&link, false).is_err());
        }
        assert!(open(&public, false).is_err());
        assert!(open(&dir, false).is_err());
        std::fs::remove_dir_all(dir).unwrap();
    }
}
