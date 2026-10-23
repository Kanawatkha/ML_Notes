export type ShareResult = 'shared' | 'cancelled' | 'unavailable';

/**
 * True when the browser can open the system share sheet on a touch device. On a laptop the
 * dialog with the QR code is the better choice, even where `navigator.share` exists.
 */
export function canNativeShare(): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') return false;
  if (typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

/**
 * Opens the system share sheet with the page title and address. A press on cancel is not an
 * error ('cancelled'); anything that stops the sheet from opening is 'unavailable', so the caller
 * can fall back to the dialog.
 */
export async function nativeShare(data: { title: string; url: string }): Promise<ShareResult> {
  if (!canNativeShare()) return 'unavailable';
  try {
    await navigator.share(data);
    return 'shared';
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled';
    return 'unavailable';
  }
}
