// Native UI the desktop shell draws (context menus, the command palette),
// drawn by the site instead with the app's own popover styles.
export type MenuItem = { label?: string; action?: () => void | Promise<void>; separator?: boolean; disabled?: boolean };

export const menu: { x: number; y: number; items: MenuItem[] } = $state({ x: 0, y: 0, items: [] });

export function openMenu(x: number, y: number, items: MenuItem[]) {
	menu.x = x;
	menu.y = y;
	menu.items = items;
}

export function closeMenu() {
	menu.items = [];
}
