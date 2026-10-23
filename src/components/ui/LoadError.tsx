import { Button } from '@/components/ui/Button';
import { UI_TEXT } from '@/config/site';

/** Shown when a generated content file could not be loaded; the retry asks for it again. */
export function LoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-start gap-4 rounded-md bg-soft-stone p-6">
      <p className="type-body">{UI_TEXT.loadError}</p>
      <Button onClick={onRetry}>{UI_TEXT.retry}</Button>
    </div>
  );
}
