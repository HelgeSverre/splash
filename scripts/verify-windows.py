#!/usr/bin/env python3
"""Check native x64 PE imports without relying on a developer machine's DLLs."""
from pathlib import Path
import struct
import sys


def imported_dlls(path):
    data = Path(path).read_bytes()
    pe = struct.unpack_from('<I', data, 0x3c)[0]
    assert data[:2] == b'MZ' and data[pe:pe+4] == b'PE\0\0', 'Not a PE executable'
    machine, count = struct.unpack_from('<HH', data, pe + 4)
    assert machine == 0x8664, 'Expected Windows x64'
    optional_size = struct.unpack_from('<H', data, pe + 20)[0]
    optional = pe + 24
    assert struct.unpack_from('<H', data, optional)[0] == 0x20b, 'Expected PE32+'
    sections = []
    for index in range(count):
        offset = optional + optional_size + index * 40
        size, rva, raw_size, raw = struct.unpack_from('<IIII', data, offset + 8)
        sections.append((rva, max(size, raw_size), raw))

    def offset_of(rva):
        for start, size, raw in sections:
            if start <= rva < start + size:
                return raw + rva - start
        raise ValueError(f'Unmapped RVA {rva:x}')

    # PE32+ data directory entry 1: IMAGE_DIRECTORY_ENTRY_IMPORT.
    rva, size = struct.unpack_from('<II', data, optional + 112 + 8)
    assert rva and size, 'Missing import directory'
    offset = offset_of(rva)
    names = []
    while True:
        descriptor = struct.unpack_from('<IIIII', data, offset)
        if not any(descriptor): break
        start = offset_of(descriptor[3])
        names.append(data[start:data.index(b'\0', start)].decode('ascii'))
        offset += 20
    return names


if __name__ == '__main__':
    for path in sys.argv[1:]:
        names = imported_dlls(path)
        forbidden = [name for name in names if name.lower().startswith(('vcruntime', 'msvcp', 'msvcr', 'concrt'))]
        assert not forbidden, f'{path} requires separately installed VC++ DLLs: {forbidden}'
        print(f'{Path(path).name}: x64 PE, no external VC++ runtime imports')
