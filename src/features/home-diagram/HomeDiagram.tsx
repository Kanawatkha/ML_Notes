import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { PlusMinusIcon } from '@/components/ui/PlusMinusIcon';
import { PAGES, UI_TEXT, type PageId } from '@/config/site';
import { loadHome, loadPage } from '@/content/loaders';
import type { HomeFile } from '@/content/types';
import { cn } from '@/lib/cn';
import { plainText } from '@/lib/text';
import './diagram.css';
import { ExamplesBlock, TopicBlock } from './DiagramBlocks';
import { DiagramNode } from './DiagramNode';
import {
  ROOT_ID,
  buildColumns,
  closeDeepest,
  columnKey,
  toggleExamples,
  toggleNode,
  toggleRoot,
  topicItems,
  type Column,
  type DiagramState,
  type FileStatus,
} from './model';
import { paramsToState, stateToParams } from './urlState';
import { useDiagramLayout, type ColumnRect } from './useDiagramLayout';
import { useLeavingColumns, type CanvasSize, type ColumnBox } from './useLeavingColumns';

const columnId = (index: number) => `diagram-col-${index}`;

const WIDTH = {
  root: 'w-[140px] md:w-[160px] lg:w-[168px]',
  topic: 'w-[min(76vw,260px)] md:w-[248px] lg:w-[260px]',
  item: 'w-[min(78vw,280px)] md:w-[264px] lg:w-[280px]',
  block: 'w-[min(90vw,640px)] md:w-[min(72vw,640px)] lg:w-[640px]',
} as const;

function widthOf(column: Column): string {
  if (column.kind === 'block' || column.kind === 'examples') return WIDTH.block;
  return column.kind === 'nodes' && column.index === 1 ? WIDTH.topic : WIDTH.item;
}

/** Plain-text label of a control, for the live region. */
function labelOf(id: string, columns: Column[]): string {
  for (const column of columns) {
    if (column.kind === 'nodes') {
      const item = column.items.find((i) => i.id === id);
      if (item) return plainText(item.title);
    }
  }
  return id;
}

function StatusCard({ children }: { children: ReactNode }) {
  return (
    <div className="diagram-enter relative z-10 rounded-md border border-hairline bg-canvas p-4">
      {children}
    </div>
  );
}

type ColumnShellProps = {
  column: Column;
  onLeave: (column: Column, box: ColumnBox) => void;
  readCanvasSize: () => CanvasSize;
  readRect: (key: string) => ColumnRect | undefined;
  className: string;
  children: ReactNode;
};

/**
 * A live column. When it is removed it reports where it was, so the diagram can keep a fading
 * copy there. Measured while still attached; a real removal is told apart from a StrictMode
 * test unmount by checking in a microtask whether the element is still in the page.
 */
function ColumnShell({
  column,
  onLeave,
  readCanvasSize,
  readRect,
  className,
  children,
}: ColumnShellProps) {
  const ref = useRef<HTMLDivElement>(null);
  const latest = useRef(column);
  useLayoutEffect(() => {
    latest.current = column;
  });
  const key = columnKey(column);
  useLayoutEffect(() => {
    const el = ref.current;
    return () => {
      if (!el) return;
      // Where it was is read from the last layout pass, not from the page: columns that are
      // removed in the same commit are taken out one by one and would slide into each other.
      const rect = readRect(key) ?? {
        left: el.offsetLeft,
        top: el.offsetTop,
        width: el.offsetWidth,
      };
      const box = { ...rect, canvas: readCanvasSize() };
      queueMicrotask(() => {
        if (!el.isConnected) onLeave(latest.current, box);
      });
    };
  }, [key, onLeave, readCanvasSize, readRect]);
  return (
    <div
      ref={ref}
      id={columnId(column.index)}
      data-col={column.index}
      data-kind={column.kind}
      data-parent={column.parentId}
      data-col-key={key}
      className={className}
    >
      {children}
    </div>
  );
}

/**
 * The home diagram: Midterm, topics, sections, sub-topics, then the explanation block and its
 * examples. It always grows to the right and nothing overlays anything. The open path is kept in
 * the hash query, so a state can be shared.
 */
export function HomeDiagram() {
  const [params, setParams] = useSearchParams();
  const [home, setHome] = useState<HomeFile | null>(null);
  const [homeFailed, setHomeFailed] = useState(false);
  const [files, setFiles] = useState<Record<string, FileStatus>>({});
  const [announcement, setAnnouncement] = useState('');

  const [state, setState] = useState<DiagramState>(() =>
    paramsToState(
      params,
      PAGES.map((p) => p.id),
    ),
  );

  const requested = useRef(new Set<string>());
  const pendingFocus = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const fetchHome = useCallback(() => {
    loadHome()
      .then((h) => {
        setHomeFailed(false);
        setHome(h);
      })
      .catch(() => setHomeFailed(true));
  }, []);

  useEffect(() => {
    fetchHome();
  }, [fetchHome]);

  const ensureFile = useCallback((page: PageId, retry = false) => {
    if (requested.current.has(page) && !retry) return;
    requested.current.add(page);
    setFiles((f) => ({ ...f, [page]: 'loading' }));
    loadPage(page)
      .then((file) => setFiles((f) => ({ ...f, [page]: file })))
      .catch(() => {
        requested.current.delete(page);
        setFiles((f) => ({ ...f, [page]: 'error' }));
      });
  }, []);

  // a state that came with the address needs its topic loaded
  useEffect(() => {
    const topic = state.path[0];
    if (topic && PAGES.some((p) => p.id === topic)) ensureFile(topic as PageId);
    // only at the start: later opens call ensureFile themselves
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ensureFile]);

  const topics = useMemo(() => (home ? topicItems(home) : []), [home]);
  const columns = useMemo(() => buildColumns(topics, files, state), [topics, files, state]);
  const signature = columns.map(columnKey).join('|') + (state.rootOpen ? '+' : '-');
  const lastKey = columns.length > 0 ? columnKey(columns[columns.length - 1]) : null;
  const deepest = columns.length > 0 ? columns[columns.length - 1].index : 0;
  const { readRect } = useDiagramLayout(scrollRef, canvasRef, svgRef, signature, lastKey, deepest);
  const { leaving, onLeave, readCanvasSize } = useLeavingColumns(scrollRef, canvasRef, deepest);

  useLayoutEffect(() => {
    const id = pendingFocus.current;
    pendingFocus.current = null;
    if (!id) return;
    canvasRef.current
      ?.querySelectorAll<HTMLElement>('[data-node-id]')
      .forEach((el) => el.dataset.nodeId === id && !el.closest('[data-leaving]') && el.focus());
  }, [state]);

  const apply = (next: DiagramState, message: string) => {
    setState(next);
    setAnnouncement(message);
    setParams(stateToParams(next), { replace: true });
  };

  const onRoot = () => {
    const next = toggleRoot(state);
    apply(next, `${next.rootOpen ? UI_TEXT.opened : UI_TEXT.closed} Midterm`);
  };

  const onNode = (column: number, id: string) => {
    const wasOpen = state.path[column - 1] === id;
    if (column === 1 && !wasOpen) ensureFile(id as PageId);
    apply(
      toggleNode(state, column, id),
      `${wasOpen ? UI_TEXT.closed : UI_TEXT.opened} ${labelOf(id, columns)}`,
    );
  };

  const onExamples = (leafId: string) => {
    const opening = state.examplesFor !== leafId;
    apply(
      toggleExamples(state, leafId),
      `${opening ? UI_TEXT.opened : UI_TEXT.closed} ${UI_TEXT.examples}`,
    );
  };

  const focusIn = (selector: string, last = false) => {
    const found = canvasRef.current?.querySelectorAll<HTMLElement>(selector);
    if (!found || found.length === 0) return false;
    found[last ? found.length - 1 : 0].focus();
    return true;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      const result = closeDeepest(state);
      if (!result.focusId) return;
      event.preventDefault();
      pendingFocus.current = result.focusId;
      apply(result.state, `${UI_TEXT.closed} ${result.state.rootOpen ? '' : 'Midterm'}`.trim());
      return;
    }
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.dataset.nodeId || target.closest('article')) {
      return;
    }
    const col = target.closest<HTMLElement>('[data-col]');
    const index = Number(col?.dataset.col ?? -1);
    if (index < 0) return;
    const nodesOf = (i: number) =>
      Array.from(
        canvasRef.current?.querySelectorAll<HTMLElement>(`[data-col="${i}"] [data-node-id]`) ?? [],
      );
    const siblings = nodesOf(index);
    const at = siblings.indexOf(target);
    let moved = true;
    if (event.key === 'ArrowDown') siblings[at + 1]?.focus();
    else if (event.key === 'ArrowUp') siblings[at - 1]?.focus();
    else if (event.key === 'ArrowRight') {
      const first = nodesOf(index + 1)[0];
      if (first) first.focus();
      else if (!focusIn(`[data-col="${index + 1}"] button`)) moved = false;
    } else if (event.key === 'ArrowLeft') {
      const parent = nodesOf(index - 1).find((el) => el.dataset.open === 'true');
      if (parent) parent.focus();
      else moved = false;
    } else moved = false;
    if (moved) event.preventDefault();
  };

  const renderColumn = (column: Column, live: boolean) => (
    <>
      {column.kind === 'nodes'
        ? column.items.map((item, order) => (
            <DiagramNode
              key={item.id}
              item={item}
              open={column.openId === item.id}
              controls={live && column.openId === item.id ? columnId(column.index + 1) : undefined}
              order={live ? order : 0}
              onToggle={() => onNode(column.index, item.id)}
            />
          ))
        : null}
      {column.kind === 'loading' ? (
        <StatusCard>
          <p role="status" className="type-caption text-body-muted">
            {UI_TEXT.loading}
          </p>
        </StatusCard>
      ) : null}
      {column.kind === 'error' ? (
        <StatusCard>
          <p role="alert" className="type-caption mb-3">
            {UI_TEXT.loadError}
          </p>
          <Button variant="secondary" onClick={() => ensureFile(column.page, true)}>
            {UI_TEXT.retry}
          </Button>
        </StatusCard>
      ) : null}
      {column.kind === 'block' ? (
        <TopicBlock
          page={column.page}
          node={column.node}
          crumb={column.crumb}
          examplesOpen={state.examplesFor === column.node.id}
          examplesColumnId={columnId(column.index + 1)}
          onToggleExamples={() => onExamples(column.node.id)}
        />
      ) : null}
      {column.kind === 'examples' ? <ExamplesBlock node={column.node} /> : null}
    </>
  );

  return (
    <div>
      <div>
        <div
          ref={scrollRef}
          role="region"
          aria-label={UI_TEXT.diagramTitle}
          onKeyDown={onKeyDown}
          className="diagram-scroll min-h-[320px] overflow-x-auto pb-2"
        >
          <div
            ref={canvasRef}
            className="relative flex w-max min-w-full items-start gap-8 px-4 md:gap-12 md:pr-8 md:pl-[max(1.5rem,calc((100%-1200px)/2+1.5rem))]"
          >
            <svg
              ref={svgRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            >
              <defs>
                <marker
                  id="diagram-dot"
                  markerWidth="8"
                  markerHeight="8"
                  refX="4"
                  refY="4"
                  markerUnits="userSpaceOnUse"
                >
                  <circle cx="4" cy="4" r="3.5" className="fill-coral" />
                </marker>
              </defs>
            </svg>
            <div data-col="0" className={cn('flex shrink-0 items-center gap-4', WIDTH.root)}>
              <button
                type="button"
                data-node-id={ROOT_ID}
                aria-expanded={state.rootOpen}
                aria-controls={state.rootOpen ? columnId(1) : undefined}
                onClick={onRoot}
                data-surface="dark"
                className="type-button relative z-10 flex h-14 w-full items-center justify-between gap-2 rounded-pill bg-primary px-5 text-on-primary active:bg-cohere-black"
              >
                Midterm
                <PlusMinusIcon open={state.rootOpen} size={18} />
              </button>
            </div>
            {!state.rootOpen ? (
              <p className="type-caption self-center text-body-muted">{UI_TEXT.diagramHint}</p>
            ) : null}
            {columns.map((column) => (
              <ColumnShell
                key={columnKey(column)}
                column={column}
                onLeave={onLeave}
                readCanvasSize={readCanvasSize}
                readRect={readRect}
                className={cn('flex shrink-0 flex-col gap-3', widthOf(column))}
              >
                {renderColumn(column, true)}
              </ColumnShell>
            ))}
            {leaving.map((item) => (
              <div
                key={`leaving-${item.token}`}
                data-leaving
                aria-hidden="true"
                inert
                style={{
                  position: 'absolute',
                  left: item.left,
                  top: item.top,
                  width: item.width,
                  animationDelay: `${item.delay}ms`,
                }}
                className={cn('diagram-leave flex flex-col gap-3', widthOf(item.column))}
              >
                {renderColumn(item.column, false)}
              </div>
            ))}
          </div>
        </div>
      </div>
      {homeFailed ? (
        <div
          role="alert"
          className="mx-auto mt-4 flex w-full max-w-[1200px] items-center gap-3 px-4 md:px-6"
        >
          <p className="type-caption">{UI_TEXT.loadError}</p>
          <Button variant="secondary" onClick={fetchHome}>
            {UI_TEXT.retry}
          </Button>
        </div>
      ) : null}
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
