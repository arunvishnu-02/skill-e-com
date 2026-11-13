import { forwardRef, useId, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cx } from "./utils";
import { AlertIcon, ArrowDownRightIcon, ArrowUpRightIcon, CheckCircleIcon, SearchIcon } from "../icons";

/* ---------------- Button ---------------- */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** secondary = ink (header CTA), primary = brand (confirm), outline, ghost, danger */
  variant?: "secondary" | "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  block?: boolean;
  icon?: ReactNode;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "outline", size = "md", block, icon, className, children, type = "button", ...rest }, ref,
) {
  return (
    <button ref={ref} type={type} className={cx("cd-btn", `cd-btn--${variant}`, size !== "md" && `cd-btn--${size}`, block && "cd-btn--block", className)} {...rest}>
      {icon}
      {children}
    </button>
  );
});

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  /** Unread indicator dot. */
  dot?: boolean;
  plain?: boolean;
}
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, dot, plain, className, children, type = "button", ...rest }, ref,
) {
  return (
    <button ref={ref} type={type} aria-label={label} className={cx("cd-icon-btn", plain && "cd-icon-btn--plain", className)} {...rest}>
      {children}
      {dot ? <span className="cd-icon-btn__dot" aria-hidden="true" /> : null}
    </button>
  );
});

/* ---------------- StatusBadge ---------------- */
export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral" | "brand" | "ink";
export function StatusBadge({ tone = "neutral", small, children, className }: { tone?: StatusTone; small?: boolean; children: ReactNode; className?: string }) {
  return <span className={cx("cd-badge", `cd-badge--${tone}`, small && "cd-badge--sm", className)}>{children}</span>;
}

/* ---------------- Cards ---------------- */
export interface DashboardCardProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  /** Remove padding (tables, lists that supply their own). */
  flush?: boolean;
  as?: "section" | "div" | "article";
  className?: string;
  children?: ReactNode;
}
export function DashboardCard({ title, subtitle, actions, flush, as: Tag = "section", className, children }: DashboardCardProps) {
  const headId = useId();
  return (
    <Tag className={cx("cd-card", flush && "cd-card--flush", className)} aria-labelledby={title ? headId : undefined}>
      {title || actions ? (
        <div className="cd-card__head">
          <div className="cd-card__titles">
            {title ? <h2 className="cd-card__title" id={headId}>{title}</h2> : null}
            {subtitle ? <p className="cd-card__subtitle">{subtitle}</p> : null}
          </div>
          {actions ? <div className="cd-card__actions">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </Tag>
  );
}

export interface StatCardProps {
  label: ReactNode;
  value: ReactNode;
  /** First KPI in the master is the dark/featured card. */
  featured?: boolean;
  delta?: { value: ReactNode; trend?: "up" | "down" | "neutral"; icon?: ReactNode };
  /** Text after the delta ("vs yesterday"). */
  note?: ReactNode;
  href?: string;
}
export function StatCard({ label, value, featured, delta, note, href }: StatCardProps) {
  const Tag = (href ? "a" : "div") as "div";
  const trend = delta?.trend ?? "up";
  const defaultIcon = trend === "up" ? <ArrowUpRightIcon /> : trend === "down" ? <AlertIcon /> : null;
  return (
    <Tag className={cx("cd-stat", featured && "cd-stat--featured")} {...(href ? ({ href } as object) : {})}>
      <p className="cd-stat__label">{label}</p>
      <p className="cd-stat__value">{value}</p>
      {delta || note ? (
        <div className="cd-stat__meta">
          {delta ? (
            <span className={cx("cd-delta", `cd-delta--${trend}`)}>
              {delta.icon ?? defaultIcon}
              {delta.value}
            </span>
          ) : null}
          {note}
        </div>
      ) : null}
    </Tag>
  );
}
/** Up/down glyph helpers if you need them outside StatCard. */
export const TrendUp = ArrowUpRightIcon;
export const TrendDown = ArrowDownRightIcon;

export function KpiGrid({ columns = 4, children }: { columns?: 2 | 3 | 4; children: ReactNode }) {
  return <div className="cd-grid cd-grid--kpi" style={{ ["--cd-cols" as string]: columns }}>{children}</div>;
}
export function CardGrid({ layout = "2-1", children }: { layout?: "2-1" | "main-aside"; children: ReactNode }) {
  return <div className={cx("cd-grid", `cd-grid--${layout}`)}>{children}</div>;
}
export function Stack({ children }: { children: ReactNode }) {
  return <div className="cd-stack">{children}</div>;
}

/* ---------------- SearchInput ---------------- */
export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { label = "Search", placeholder = "Search…", className, ...rest }, ref,
) {
  return (
    <label className={cx("cd-search", className)}>
      <SearchIcon />
      <span className="cd-sr-only">{label}</span>
      <input ref={ref} type="search" placeholder={placeholder} {...rest} />
    </label>
  );
});

/* ---------------- Form controls ---------------- */
export interface FormFieldProps {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  full?: boolean;
  /** Receives ids to wire to your control, or pass a ready-made control via children. */
  children: ReactNode | ((a11y: { id: string; "aria-describedby"?: string; "aria-invalid"?: boolean }) => ReactNode);
}
export function FormField({ label, hint, error, required, full, children }: FormFieldProps) {
  const id = useId();
  const descId = `${id}-d`;
  const describedBy = error || hint ? descId : undefined;
  return (
    <div className={cx("cd-field", full && "cd-field--full")}>
      <label className="cd-field__label" htmlFor={id}>
        {label}
        {required ? <span className="cd-field__required" aria-hidden="true">*</span> : null}
      </label>
      {typeof children === "function" ? children({ id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined }) : children}
      {error ? <p className="cd-field__error" id={descId} role="alert">{error}</p> : hint ? <p className="cd-field__hint" id={descId}>{hint}</p> : null}
    </div>
  );
}
export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function TextInput({ className, ...rest }, ref) {
  return <input ref={ref} className={cx("cd-input", className)} {...rest} />;
});
export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function TextArea({ className, ...rest }, ref) {
  return <textarea ref={ref} className={cx("cd-textarea", className)} {...rest} />;
});
export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select({ className, children, ...rest }, ref) {
  return <select ref={ref} className={cx("cd-select", className)} {...rest}>{children}</select>;
});
export function FormGrid({ children }: { children: ReactNode }) {
  return <div className="cd-form-grid">{children}</div>;
}

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label: ReactNode;
  hint?: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}
export function Toggle({ label, hint, checked, onChange, ...rest }: ToggleProps) {
  const id = useId();
  return (
    <label className="cd-toggle" htmlFor={id}>
      <span className="cd-toggle__text">
        <span className="cd-toggle__label">{label}</span>
        {hint ? <span className="cd-toggle__hint">{hint}</span> : null}
      </span>
      <input id={id} role="switch" type="checkbox" className="cd-toggle__input" checked={checked} onChange={(e) => onChange(e.target.checked)} {...rest} />
    </label>
  );
}

/** Radio-style segmented choice (Figma "Single product / Product with variants"). */
export function ChoiceGroup<T extends string>({
  value, onChange, options, label,
}: { value: T; onChange: (v: T) => void; label: string; options: Array<{ value: T; title: ReactNode; hint?: ReactNode }> }) {
  return (
    <div className="cd-choice" role="radiogroup" aria-label={label} style={{ ["--cd-cols" as string]: options.length }}>
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={o.value === value} className="cd-choice__option" onClick={() => onChange(o.value)}>
          <span className="cd-choice__title">{o.title}</span>
          {o.hint ? <span className="cd-choice__hint">{o.hint}</span> : null}
        </button>
      ))}
    </div>
  );
}

export function Chip({ pressed, onClick, children }: { pressed?: boolean; onClick?: () => void; children: ReactNode }) {
  return <button type="button" className="cd-chip" aria-pressed={pressed} onClick={onClick}>{children}</button>;
}

/* ---------------- Alerts / states ---------------- */
export function Alert({ tone = "info", children }: { tone?: "success" | "warning" | "danger" | "info"; children: ReactNode }) {
  return (
    <div className={cx("cd-alert", `cd-alert--${tone}`)} role={tone === "danger" ? "alert" : "status"}>
      {tone === "success" ? <CheckCircleIcon /> : <AlertIcon />}
      <div>{children}</div>
    </div>
  );
}

export interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  text?: ReactNode;
  tone?: "default" | "error" | "success";
  actions?: ReactNode;
}
export function EmptyState({ icon, title, text, tone = "default", actions }: EmptyStateProps) {
  return (
    <div className={cx("cd-empty", tone !== "default" && `cd-empty--${tone}`)} role={tone === "error" ? "alert" : undefined}>
      {icon ? <span className="cd-empty__icon">{icon}</span> : null}
      <p className="cd-empty__title">{title}</p>
      {text ? <p className="cd-empty__text">{text}</p> : null}
      {actions ? <div className="cd-empty__actions">{actions}</div> : null}
    </div>
  );
}

export function Skeleton({ width = "100%", height = 14, radius, style }: { width?: number | string; height?: number | string; radius?: number | string; style?: React.CSSProperties }) {
  return <span className="cd-skeleton" aria-hidden="true" style={{ width, height, borderRadius: radius, ...style }} />;
}

/** Loading placeholders that match the layout of the real components. */
export function LoadingSkeleton({ variant, rows = 5 }: { variant: "stat" | "table" | "card" | "chart"; rows?: number }) {
  if (variant === "stat") {
    return (
      <div className="cd-stat" role="status" aria-busy="true" aria-label="Loading">
        <Skeleton width={90} height={13} /><Skeleton width={110} height={38} /><Skeleton width={130} height={20} radius={999} />
      </div>
    );
  }
  if (variant === "chart") {
    return (
      <div className="cd-card" role="status" aria-busy="true" aria-label="Loading">
        <Skeleton width={160} height={17} />
        <div className="cd-bars">
          {[90, 96, 126, 176, 188, 107, 135].map((h, i) => (
            <div key={i} className="cd-bars__col"><Skeleton width={36} height={h} radius="5px 5px 0 0" /></div>
          ))}
        </div>
      </div>
    );
  }
  if (variant === "table") {
    return (
      <div role="status" aria-busy="true" aria-label="Loading" style={{ display: "flex", flexDirection: "column", gap: 14, padding: 20 }}>
        {Array.from({ length: rows }).map((_, i) => <Skeleton key={i} height={36} />)}
      </div>
    );
  }
  return (
    <div className="cd-card" role="status" aria-busy="true" aria-label="Loading">
      <Skeleton width={140} height={17} /><Skeleton height={14} /><Skeleton height={14} width="80%" />
    </div>
  );
}
