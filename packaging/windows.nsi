Unicode True
!include "MUI2.nsh"
Name "Splash"
OutFile "${OUTPUT}"
InstallDir "$LOCALAPPDATA\Programs\Splash"
RequestExecutionLevel user
!define MUI_ABORTWARNING
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_LANGUAGE "English"
Section "Splash"
  SetOutPath "$INSTDIR"
  File "${SOURCE}\splash.exe"
  File "${SOURCE}\LICENSE"
  File "${SOURCE}\README.txt"
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  CreateDirectory "$SMPROGRAMS\Splash"
  CreateShortcut "$SMPROGRAMS\Splash\Splash.lnk" "$INSTDIR\splash.exe"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Splash" "DisplayName" "Splash"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Splash" "DisplayVersion" "${VERSION}"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Splash" "UninstallString" '$"$INSTDIR\Uninstall.exe$"'
SectionEnd
Section "Uninstall"
  Delete "$INSTDIR\splash.exe"
  Delete "$INSTDIR\LICENSE"
  Delete "$INSTDIR\README.txt"
  Delete "$INSTDIR\Uninstall.exe"
  Delete "$SMPROGRAMS\Splash\Splash.lnk"
  RMDir "$SMPROGRAMS\Splash"
  RMDir "$INSTDIR"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Splash"
  ; User conversations/configuration are deliberately retained.
SectionEnd
