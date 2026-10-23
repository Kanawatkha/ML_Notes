type PlusMinusIconProps = { open: boolean; size?: number };

/**
 * A plus whose vertical bar turns flat onto the horizontal one when `open`, so the sign changes
 * into a minus with a short rotation (A7). Decorative: the control that holds it has the label
 * and `aria-expanded`.
 */
export function PlusMinusIcon({ open, size = 18 }: PlusMinusIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      className="plus-icon"
      data-open={open ? '' : undefined}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" className="plus-bar" />
    </svg>
  );
}
