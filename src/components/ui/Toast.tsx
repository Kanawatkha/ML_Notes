import type { ReactNode } from 'react';

type ToastProps = { children: ReactNode; action?: ReactNode };

/** Dark console-style toast (the design's agent-console card). Shown by app/pwa/ToastHost. */
export function Toast({ children, action }: ToastProps) {
  return (
    <div
      role="status"
      data-surface="dark"
      className="toast-in type-caption flex items-center gap-4 rounded-sm bg-primary p-5 text-on-dark"
    >
      <span>{children}</span>
      {action}
    </div>
  );
}
