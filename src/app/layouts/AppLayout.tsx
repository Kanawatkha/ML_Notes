import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastHost } from '@/app/pwa/ToastHost';
import { Navbar } from '@/components/layout/Navbar';
import { UI_TEXT } from '@/config/site';

export function AppLayout() {
  const mainRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const first = useRef(true);

  // After a navigation, move focus to <main> so keyboard and screen reader users start at the content.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <a
        href="#main"
        className="type-button sr-only rounded-sm bg-primary px-4 py-3 text-on-primary focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[80]"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus();
        }}
      >
        {UI_TEXT.skipToContent}
      </a>
      <Navbar />
      <main id="main" ref={mainRef} tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <ToastHost />
    </>
  );
}
