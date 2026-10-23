type IconName = 'menu' | 'close' | 'chevron-right' | 'share' | 'copy' | 'check' | 'arrow-up';

const PATHS: Record<IconName, string> = {
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  'chevron-right': 'M9 5l7 7-7 7',
  share:
    'M21 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM9 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 19a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4',
  copy: 'M11 9h7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
  check: 'M5 12.5l5 5 9-10.5',
  'arrow-up': 'M12 19V5M5 12l7-7 7 7',
};

type IconProps = { name: IconName; size?: number; className?: string };

/** Decorative stroke icon. Pair it with a text label or aria-label on the parent control. */
export function Icon({ name, size = 20, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
