import { Link } from 'react-router-dom';
import { InlineContent } from '@/components/content/InlineContent';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { KIND_LABEL, UI_TEXT } from '@/config/site';
import { BAND_CLASS } from '@/lib/bands';
import { cn } from '@/lib/cn';
import { padNumber } from '@/lib/text';
import type { NodeItem } from './model';

type DiagramNodeProps = {
  item: NodeItem;
  open: boolean;
  /** Id of the column this node opens, set only while it is open. */
  controls?: string;
  /** Position in its column, used to stagger the enter animation. */
  order: number;
  onToggle: () => void;
};

/**
 * One node of the diagram (UI-SPEC.md section 4.3). A topic is a card with its mono tag, colour
 * swatch, Latin title and a count; a section or sub-topic is a smaller card with its number. A node
 * with children is a disclosure button; the open node gets an ink border. A leaf is a link to its
 * part of the topic page.
 */
export function DiagramNode({ item, open, controls, order, onToggle }: DiagramNodeProps) {
  const topic = item.topic;
  const className = cn(
    'diagram-enter relative z-10 flex w-full items-center gap-3 border border-l-[3px] bg-canvas text-left',
    topic ? 'rounded-md p-5' : 'rounded-sm px-4 py-3.5',
    open ? 'border-ink' : 'border-hairline border-l-hairline',
    item.href && 'transition-colors duration-[160ms] hover:border-ink',
  );
  const style = { animationDelay: `${order * 40}ms` };
  const content = (
    <>
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        {topic ? (
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={cn('size-3 shrink-0 rounded-xs', BAND_CLASS[topic.band].bg)}
            />
            <Chip>{KIND_LABEL[topic.kind]}</Chip>
          </span>
        ) : null}
        {!topic && item.number ? (
          <span className="type-mono text-body-muted tabular">{padNumber(item.number)}</span>
        ) : null}
        <span className={topic ? 'type-feature-heading' : 'type-body font-medium'}>
          <InlineContent nodes={item.title} />
        </span>
        {topic ? (
          <span className="type-caption text-body-muted">
            {topic.count} {UI_TEXT.diagramCountUnit}
          </span>
        ) : null}
      </span>
      <Icon
        name="chevron-right"
        size={18}
        className={cn(
          'shrink-0 text-body-muted transition-transform duration-200',
          open && 'rotate-90 text-ink',
        )}
      />
    </>
  );
  if (item.href) {
    return (
      <Link to={item.href} data-node-id={item.id} style={style} className={className}>
        {content}
      </Link>
    );
  }
  return (
    <button
      type="button"
      data-node-id={item.id}
      data-open={open}
      aria-expanded={open}
      aria-controls={controls}
      onClick={onToggle}
      style={style}
      className={className}
    >
      {content}
    </button>
  );
}
