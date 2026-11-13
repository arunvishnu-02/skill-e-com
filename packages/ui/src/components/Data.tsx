import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "./utils";
import { MoreIcon } from "../icons";
import { DashboardCard, EmptyState, LoadingSkeleton, IconButton } from "./Primitives";
import { InboxIcon, AlertIcon } from "../icons";

/* ---------------- Tabs ---------------- */
export interface TabItem { id: string; label: ReactNode; count?: number | string }
export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  /** boxed = order status tabs, segmented = 7D/30D/90D, pill = notifications */
  variant?: "boxed" | "segmented" | "pill";
  label: string;
}
export function Tabs({ items, value, onChange, variant = "boxed", label }: TabsProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const onKey = (e: KeyboardEvent, i: number) => {
    let n = i;
    if (e.key === "ArrowRight") n = (i + 1) % items.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + items.length) % items.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = items.length - 1;
    else return;
    e.preventDefault();
    onChange(items[n].id);
    refs.current[n]?.focus();
  };
  return (
    <div className={cx("cd-tabs", `cd-tabs--${variant}`)} role="tablist" aria-label={label}>
      {items.map((t, i) => (
        <button
          key={t.id}
          ref={(el) => { refs.current[i] = el; }}
          role="tab"
          type="button"
          className="cd-tab"
          aria-selected={t.id === value}
          tabIndex={t.id === value ? 0 : -1}
          onClick={() => onChange(t.id)}
          onKeyDown={(e) => onKey(e, i)}
        >
          {t.label}
          {t.count !== undefined ? <span className="cd-tab__count">{t.count}</span> : null}
        </button>
      ))}
    </div>
  );
}

/* ---------------- FilterBar ---------------- */
export function FilterBar({ tabs, actions }: { tabs?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="cd-filterbar">
      {tabs}
      {actions ? <div className="cd-filterbar__actions">{actions}</div> : null}
    </div>
  );
}

/* ---------------- RowMenu (⋯) ---------------- */
export interface MenuAction { id: string; label: string; icon?: ReactNode; danger?: boolean; onSelect: () => void }
export function RowMenu({ actions, label = "Row actions" }: { actions: MenuAction[]; label?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: globalThis.KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, [open]);
  return (
    <div className="cd-popover-anchor" ref={ref}>
      <IconButton label={label} plain aria-haspopup="menu" aria-expanded={open} aria-controls={open ? menuId : undefined} onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}>
        <MoreIcon />
      </IconButton>
      {open ? (
        <ul className="cd-menu" role="menu" id={menuId}>
          {actions.map((a) => (
            <li key={a.id} role="none">
              <button role="menuitem" type="button" className={cx("cd-menu__item", a.danger && "cd-menu__item--danger")} onClick={() => { setOpen(false); a.onSelect(); }}>
                {a.icon}{a.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/* ---------------- DataTable ---------------- */
export interface Column<T> {
  id: string;
  header: ReactNode;
  /** Render cell. Business formatting (currency, dates) belongs here, not in the library. */
  cell: (row: T) => ReactNode;
  width?: number | string;
  align?: "left" | "right" | "center";
  /** Hide on mobile card layout. */
  hideOnMobile?: boolean;
}
export interface DataTableProps<T> {
  columns: Array<Column<T>>;
  rows: T[];
  rowKey: (row: T) => string;
  /** "compact" = dashboard recent-orders card, "full" = list page (64px rows). */
  density?: "compact" | "full";
  onRowClick?: (row: T) => void;
  highlightRow?: (row: T) => boolean;
  loading?: boolean;
  error?: ReactNode;
  onRetry?: () => void;
  empty?: ReactNode;
  caption: string;
  /** Group rows under month-style header rows. */
  groupBy?: (row: T) => { id: string; label: ReactNode; meta?: ReactNode };
  footer?: ReactNode;
  /** Mobile (<768px) renders each row as a card using this; falls back to horizontal scroll if omitted. */
  mobileCard?: (row: T) => ReactNode;
}

export function DataTable<T>({
  columns, rows, rowKey, density = "compact", onRowClick, highlightRow, loading, error, onRetry, empty, caption, groupBy, footer, mobileCard,
}: DataTableProps<T>) {
  if (loading) return <LoadingSkeleton variant="table" />;
  if (error) {
    return <EmptyState tone="error" icon={<AlertIcon />} title="Couldn’t load data" text={error} actions={onRetry ? <button className="cd-btn cd-btn--outline cd-btn--sm" onClick={onRetry}>Try again</button> : undefined} />;
  }
  if (!rows.length) return <>{empty ?? <EmptyState icon={<InboxIcon />} title="Nothing here yet" text="When there is data it will appear here." />}</>;

  let lastGroup: string | undefined;
  const body: ReactNode[] = [];
  rows.forEach((row) => {
    if (groupBy) {
      const g = groupBy(row);
      if (g.id !== lastGroup) {
        lastGroup = g.id;
        body.push(
          <tr key={`g-${g.id}`} className="cd-table__group">
            <td colSpan={columns.length}><strong>{g.label}</strong>{g.meta}</td>
          </tr>,
        );
      }
    }
    const clickable = !!onRowClick;
    body.push(
      <tr
        key={rowKey(row)}
        data-clickable={clickable || undefined}
        data-highlight={highlightRow?.(row) || undefined}
        onClick={clickable ? () => onRowClick!(row) : undefined}
      >
        {columns.map((c) => <td key={c.id} data-align={c.align}>{c.cell(row)}</td>)}
      </tr>,
    );
  });

  return (
    <div className="cd-table-wrap" data-mobile={mobileCard ? "cards" : undefined}>
      <table className={cx("cd-table", `cd-table--${density}`)}>
        <caption className="cd-sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.id} scope="col" data-align={c.align} style={{ width: c.width }}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{body}</tbody>
      </table>
      {mobileCard ? (
        <ul className="cd-table__cards cd-list">
          {rows.map((r) => (
            <li key={rowKey(r)} className="cd-list__item" onClick={onRowClick ? () => onRowClick(r) : undefined}>{mobileCard(r)}</li>
          ))}
        </ul>
      ) : null}
      {footer ? <div className="cd-table__footer">{footer}</div> : null}
    </div>
  );
}

/** Convenience: a card wrapping a table, like "Recent orders" / "Orders table". */
export function TableCard({ title, actions, children, flush = false }: { title?: ReactNode; actions?: ReactNode; children: ReactNode; flush?: boolean }) {
  return (
    <DashboardCard title={title} actions={actions} flush={flush} className="cd-card--tight">
      {children}
    </DashboardCard>
  );
}

/* ---------------- Charts ---------------- */
export interface BarDatum { label: string; value: number; tooltip?: { title: ReactNode; detail?: ReactNode } }
export function BarChart({ data, activeIndex, height = 240, ariaLabel }: { data: BarDatum[]; activeIndex?: number; height?: number; ariaLabel: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const labelRoom = 28;
  const active = activeIndex !== undefined ? data[activeIndex] : undefined;
  return (
    <div className="cd-bars" role="img" aria-label={ariaLabel} style={{ height }}>
      {data.map((d, i) => {
        const h = Math.max(4, Math.round((d.value / max) * (height - labelRoom - 8) * 0.84));
        return (
          <div className="cd-bars__col" key={d.label} data-active={i === activeIndex || undefined}>
            {i === activeIndex && active?.tooltip ? (
              <div className="cd-tooltip" style={{ bottom: h + labelRoom + 4, right: 0 }}>
                <strong>{active.tooltip.title}</strong>
                {active.tooltip.detail ? <span>{active.tooltip.detail}</span> : null}
              </div>
            ) : null}
            <div className="cd-bars__bar" style={{ height: h }} />
            <span className="cd-bars__label">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export interface ProgressDatum { label: ReactNode; value: number; display?: ReactNode; /** Plain-text name for assistive tech when `label` is not a string. */ ariaLabel?: string }
export function ProgressList({ items, highlightFirst = true }: { items: ProgressDatum[]; highlightFirst?: boolean }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="cd-progress-list">
      {items.map((it, i) => (
        <li key={i} className="cd-progress" data-highlight={(highlightFirst && i === 0) || undefined}>
          <div className="cd-progress__row">
            <span className="cd-progress__label">{it.label}</span>
            <span className="cd-progress__value">{it.display ?? `${it.value}%`}</span>
          </div>
          <div className="cd-progress__track" role="progressbar" aria-label={it.ariaLabel ?? (typeof it.label === "string" ? it.label : undefined)} aria-valuenow={it.value} aria-valuemin={0} aria-valuemax={100}>
            <div className="cd-progress__fill" style={{ width: `${(it.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export interface ChartCardProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** e.g. a <Tabs variant="segmented"/> range switcher */
  actions?: ReactNode;
  loading?: boolean;
  error?: ReactNode;
  empty?: boolean;
  children: ReactNode;
}
export function ChartCard({ title, subtitle, actions, loading, error, empty, children }: ChartCardProps) {
  let body: ReactNode = children;
  if (loading) body = <LoadingSkeleton variant="chart" />;
  else if (error) body = <EmptyState tone="error" icon={<AlertIcon />} title="Couldn’t load chart" text={error} />;
  else if (empty) body = <EmptyState icon={<InboxIcon />} title="No data for this period" />;
  return (
    <DashboardCard title={title} subtitle={subtitle} actions={actions}>
      {body}
    </DashboardCard>
  );
}
