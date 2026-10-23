import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { HOME_ROUTE, PAGES, UI_TEXT } from '@/config/site';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { BAND_CLASS } from '@/lib/bands';
import { cn } from '@/lib/cn';
import './overlay.css';

type MobileMenuProps = { id: string; open: boolean; onClose: () => void };

const CLOSE_MS = 220;

/**
 * Full-height white sheet below the navbar (UI-SPEC.md section 2): Home, then one row per topic
 * with its number, colour swatch, title and a chevron. The page below is dimmed and blurred; a press
 * on it closes the menu. It stays mounted for the length of the close animation. Focus is trapped
 * while open, Esc closes, the page behind does not scroll.
 */
export function MobileMenu({ id, open, onClose }: MobileMenuProps) {
  const [mounted, setMounted] = useState(open);
  const panelRef = useRef<HTMLDivElement>(null);

  if (open && !mounted) setMounted(true);

  useEffect(() => {
    if (open || !mounted) return;
    const timer = setTimeout(() => setMounted(false), CLOSE_MS);
    return () => clearTimeout(timer);
  }, [open, mounted]);

  // the hamburger disappears from md up, so the menu must not stay open behind the tab row
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const wide = window.matchMedia('(min-width: 768px)');
    const onChange = () => wide.matches && onClose();
    wide.addEventListener('change', onChange);
    return () => wide.removeEventListener('change', onChange);
  }, [onClose]);

  useFocusTrap(panelRef, open, onClose);
  useLockBodyScroll(mounted);

  if (!mounted) return null;

  return (
    <div
      data-state={open ? 'open' : 'closed'}
      className="blur-overlay fixed inset-x-0 top-[var(--spacing-nav)] bottom-0 z-40 overflow-hidden md:hidden"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        id={id}
        className="menu-panel max-h-full overflow-y-auto overscroll-contain border-b border-hairline bg-canvas"
      >
        <ul>
          <li className="border-b border-hairline">
            <MenuRow to={HOME_ROUTE} end>
              <span className="w-8" aria-hidden="true" />
              <span className="size-3" aria-hidden="true" />
              <span className="type-feature-heading flex-1">{UI_TEXT.home}</span>
            </MenuRow>
          </li>
          {PAGES.map((page, index) => (
            <li key={page.id} className="border-b border-hairline last:border-b-0">
              <MenuRow to={page.route}>
                <span className="type-mono w-8 text-body-muted" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className={cn('size-3 rounded-xs', BAND_CLASS[page.band].bg)}
                  aria-hidden="true"
                />
                <span className="type-feature-heading flex-1">{page.label}</span>
              </MenuRow>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

type MenuRowProps = { to: string; end?: boolean; children: React.ReactNode };

function MenuRow({ to, end, children }: MenuRowProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex h-16 items-center gap-3 px-4 text-ink',
          isActive && 'border-l-[3px] border-primary bg-soft-stone pl-[13px]',
        )
      }
    >
      {children}
      <Icon name="chevron-right" size={18} className="text-body-muted" />
    </NavLink>
  );
}
