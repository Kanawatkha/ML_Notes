import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Logo } from '@/components/layout/Logo';
import { MenuToggleIcon } from '@/components/layout/MenuToggleIcon';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { ReadingProgress } from '@/components/layout/ReadingProgress';
import { ShareDialog } from '@/components/layout/ShareDialog';
import { buttonClass } from '@/components/ui/buttonClass';
import { Icon } from '@/components/ui/Icon';
import { EXTRA_PAGES, HOME_ROUTE, PAGES, SITE_NAME, UI_TEXT } from '@/config/site';
import { BAND_CLASS } from '@/lib/bands';
import { cn } from '@/lib/cn';

const MENU_ID = 'mobile-menu';

/**
 * Top navigation, three zones (UI-SPEC.md section 2): logo on the left, the three topic tabs
 * centered (from md up), the share button on the right and, below md, the hamburger. A hairline
 * rule fades in under the bar once the page has scrolled a little.
 */
export function Navbar() {
  // The menu is "open at" a path, so any navigation (link press, back gesture) closes it.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const shareRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  const open = openAt === pathname;
  const onTopicPage =
    PAGES.some((page) => page.route === pathname) ||
    EXTRA_PAGES.some((page) => page.route === pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = useCallback(() => {
    setOpenAt(null);
    toggleRef.current?.focus();
  }, []);

  const closeShare = useCallback(() => {
    setShareUrl(null);
    shareRef.current?.focus();
  }, []);

  // the same dialog on every device; where the system share sheet exists it is offered inside it
  const share = () => {
    setOpenAt(null);
    setShareUrl(window.location.href);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b bg-canvas transition-colors duration-[160ms] print:hidden',
        scrolled ? 'border-hairline' : 'border-transparent',
      )}
    >
      <nav
        aria-label={SITE_NAME}
        className="mx-auto grid h-[var(--spacing-nav)] max-w-[1200px] grid-cols-[1fr_auto] items-center gap-4 px-4 md:grid-cols-[1fr_auto_1fr] md:px-6"
      >
        <Link
          to={HOME_ROUTE}
          className="justify-self-start rounded-sm"
          aria-label={`${SITE_NAME}: ${UI_TEXT.home}`}
        >
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {PAGES.map((page) => (
            <li key={page.id}>
              <NavLink
                to={page.route}
                className={({ isActive }) =>
                  cn(
                    'type-button inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 whitespace-nowrap transition-colors duration-[160ms]',
                    isActive ? 'border-primary text-primary' : 'border-transparent text-ink',
                  )
                }
              >
                <span
                  aria-hidden="true"
                  className={cn('size-2 rounded-full', BAND_CLASS[page.band].bg)}
                />
                {page.label}
              </NavLink>
            </li>
          ))}
          {EXTRA_PAGES.map((page) => (
            <li key={page.id}>
              <NavLink
                to={page.route}
                className={({ isActive }) =>
                  cn(
                    'type-button inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 whitespace-nowrap transition-colors duration-[160ms]',
                    isActive ? 'border-primary text-primary' : 'border-transparent text-ink',
                  )
                }
              >
                <span aria-hidden="true" className="size-2 rounded-full border border-ink" />
                {page.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1 justify-self-end">
          <button
            ref={shareRef}
            type="button"
            className={cn(
              buttonClass('outline'),
              'size-11 rounded-full p-0 md:size-auto md:rounded-xl md:px-3.5',
            )}
            aria-haspopup="dialog"
            aria-label={UI_TEXT.share}
            onClick={share}
          >
            <Icon name="share" size={18} />
            <span className="hidden md:inline">{UI_TEXT.share}</span>
          </button>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-sm text-ink md:hidden"
            aria-expanded={open}
            aria-controls={MENU_ID}
            aria-label={open ? UI_TEXT.menuClose : UI_TEXT.menuOpen}
            onClick={() => (open ? close() : setOpenAt(pathname))}
          >
            <MenuToggleIcon open={open} />
          </button>
        </div>
      </nav>

      {onTopicPage ? <ReadingProgress /> : null}

      <ShareDialog open={shareUrl !== null} onClose={closeShare} url={shareUrl ?? ''} />

      <MobileMenu id={MENU_ID} open={open} onClose={close} />
    </header>
  );
}
