// Toasts the app's components raise (errors, "copied"), shown by the site's
// Toasts component instead of the native shell.
export type Toast = { id: number; message: string; variant: 'info' | 'success' | 'error' };

export const toasts: Toast[] = $state([]);
let next = 0;

export function pushToast(message: string, variant: Toast['variant'] = 'info', duration = 4000) {
	const id = ++next;
	toasts.push({ id, message, variant });
	setTimeout(() => {
		const i = toasts.findIndex((t) => t.id === id);
		if (i !== -1) toasts.splice(i, 1);
	}, duration);
}
