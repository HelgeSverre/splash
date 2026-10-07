export const folderPicker = $state({ open: false });
let resolve: ((path: string | null) => void) | undefined;
export function pickServerFolder(): Promise<string | null> {
  resolve?.(null);
  folderPicker.open = true;
  return new Promise((done) => { resolve = done; });
}
export function finishFolderPicker(path: string | null) {
  folderPicker.open = false;
  resolve?.(path);
  resolve = undefined;
}
