import { afterEach, describe, expect, it, vi } from 'vitest';
import { canNativeShare, nativeShare } from './share';

function stub(options: { share?: (data: ShareData) => Promise<void>; coarse: boolean }) {
  Object.defineProperty(navigator, 'share', {
    value: options.share,
    configurable: true,
    writable: true,
  });
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: options.coarse && query === '(pointer: coarse)',
  })) as unknown as typeof window.matchMedia;
}

afterEach(() => {
  Object.defineProperty(navigator, 'share', {
    value: undefined,
    configurable: true,
    writable: true,
  });
});

describe('canNativeShare', () => {
  it('is false when the browser has no share sheet', () => {
    stub({ coarse: true });
    expect(canNativeShare()).toBe(false);
  });

  it('is false on a device with a mouse, even where the sheet exists', () => {
    stub({ share: () => Promise.resolve(), coarse: false });
    expect(canNativeShare()).toBe(false);
  });

  it('is true on a touch device with a share sheet', () => {
    stub({ share: () => Promise.resolve(), coarse: true });
    expect(canNativeShare()).toBe(true);
  });
});

describe('nativeShare', () => {
  const data = { title: 'ML Notes', url: 'https://example.test/#/' };

  it('opens the sheet with the title and address', async () => {
    const share = vi.fn(() => Promise.resolve());
    stub({ share, coarse: true });
    expect(await nativeShare(data)).toBe('shared');
    expect(share).toHaveBeenCalledWith(data);
  });

  it('treats a cancelled sheet as a normal outcome', async () => {
    stub({
      share: () => Promise.reject(new DOMException('cancelled', 'AbortError')),
      coarse: true,
    });
    expect(await nativeShare(data)).toBe('cancelled');
  });

  it('reports unavailable when the sheet fails or does not exist', async () => {
    stub({ share: () => Promise.reject(new DOMException('no', 'NotAllowedError')), coarse: true });
    expect(await nativeShare(data)).toBe('unavailable');
    stub({ coarse: false });
    expect(await nativeShare(data)).toBe('unavailable');
  });
});
