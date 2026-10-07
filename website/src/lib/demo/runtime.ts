// `@elyra/runtime` for the website. The desktop app's components import this
// module for commands, events and native UI; here commands go to the demo
// backend, events come from it, and native UI becomes browser equivalents.
import { handle, subscribe } from './backend';
import { pushToast } from './toasts.svelte';
import { openMenu, type MenuItem } from './overlays.svelte';

export function invoke<T = unknown>(command: string, ...args: unknown[]): Promise<T> {
	return handle(command, args) as Promise<T>;
}

export function channel<T = unknown>(name: string) {
	return { subscribe: (handler: (value: T | undefined) => void) => subscribe(name, handler as (value: unknown) => void) };
}

export function toast(message: string, options: { variant?: 'info' | 'success' | 'error'; duration?: number } = {}) {
	pushToast(message, options.variant, options.duration);
}

export const shell = {
	async openExternal(target: string) {
		if (/^https?:\/\//i.test(target)) window.open(target, '_blank', 'noopener,noreferrer');
		else pushToast('That path is on the demo machine. Open Splash to browse your own files.');
	}
};

export const clipboard = {
	readText: async () => (await navigator.clipboard?.readText()) ?? '',
	writeText: async (text: string) => navigator.clipboard?.writeText(text)
};

export const dialog = {
	open: async (_options?: object): Promise<string[]> => [],
	save: async (_options?: object): Promise<string | null> => null
};

export async function confirm(message: string, _options?: object) {
	return window.confirm(message);
}

export async function prompt(message: string, options: { defaultValue?: string } = {}) {
	return window.prompt(message, options.defaultValue ?? '');
}

export async function alert(message: string) {
	pushToast(message);
}

export async function notify(_title: string, _body?: string) {}

export function contextMenu(event: MouseEvent, items: MenuItem[]) {
	event.preventDefault();
	openMenu(event.clientX, event.clientY, items);
}

export function registerCommands(_commands: unknown[]) {}

export function closeCommandPalette() {}

export function openCommandPalette(_commands?: unknown[]) {
	pushToast('The command palette (⌘K) is available in the desktop app.');
}
