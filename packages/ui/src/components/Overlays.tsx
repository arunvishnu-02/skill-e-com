import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cx } from "./utils";
import { CloseIcon, BellIcon } from "../icons";
import { IconButton, StatusBadge } from "./Primitives";
import { Tabs, type TabItem } from "./Data";

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Traps focus, closes on Escape, restores focus on unmount, locks body scroll. */
function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const node = ref.current;
    (node?.querySelector<HTMLElement>("[data-autofocus]") ?? node?.querySelector<HTMLElement>(FOCUSABLE))?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.stopPropagation(); onClose(); return; }
      if (e.key !== "Tab" || !node) return;
      const f = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prev?.focus?.();
    };
  }, [open, onClose]);
  return ref;
}

/** Portal target keeps the theme: copies the nearest .cd-root's variables. */
function ThemedPortal({ children, anchor }: { children: ReactNode; anchor: React.RefObject<HTMLElement | null> }) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const el = document.createElement("div");
    el.className = "cd-root";
    const root = (anchor.current?.closest(".cd-root") as HTMLElement | null) ?? document.querySelector<HTMLElement>(".cd-root");
    if (root) {
      el.setAttribute("style", root.getAttribute("style") ?? "");
      const mode = root.getAttribute("data-cd-mode");
      if (mode) el.setAttribute("data-cd-mode", mode);
    }
    document.body.appendChild(el);
    setHost(el);
    return () => { document.body.removeChild(el); };
  }, [anchor]);
  return host ? createPortal(children, host) : null;
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  /** Buttons row; typically Cancel (outline) + confirm (primary). */
  actions?: ReactNode;
}
/** Restock-style modal (297:5976): Display title, 16px radius, 24px padding, overlay at 40% ink. */
export function Modal({ open, onClose, title, subtitle, size = "sm", children, actions }: ModalProps) {
  const ref = useDialog(open, onClose);
  const anchor = useRef<HTMLElement | null>(null);
  const titleId = useId();
  if (!open) return null;
  return (
    <ThemedPortal anchor={anchor}>
      <div className="cd-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div ref={ref} className={cx("cd-modal", size !== "sm" && `cd-modal--${size}`)} role="dialog" aria-modal="true" aria-labelledby={titleId}>
          <div className="cd-modal__head">
            <div className="cd-modal__titles">
              <h2 className="cd-modal__title" id={titleId}>{title}</h2>
              {subtitle ? <p className="cd-modal__subtitle">{subtitle}</p> : null}
            </div>
            <IconButton label="Close" plain onClick={onClose}><CloseIcon /></IconButton>
          </div>
          {children}
          {actions ? <div className="cd-modal__actions">{actions}</div> : null}
        </div>
      </div>
    </ThemedPortal>
  );
}

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  flush?: boolean;
}
/** Side drawer (derived from the notifications panel + modal tokens). */
export function Drawer({ open, onClose, title, children, footer, flush }: DrawerProps) {
  const ref = useDialog(open, onClose);
  const anchor = useRef<HTMLElement | null>(null);
  const titleId = useId();
  if (!open) return null;
  return (
    <ThemedPortal anchor={anchor}>
      <div className="cd-overlay cd-overlay--drawer" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <aside ref={ref} className="cd-drawer" role="dialog" aria-modal="true" aria-labelledby={titleId}>
          <div className="cd-drawer__head">
            <h2 className="cd-drawer__title" id={titleId}>{title}</h2>
            <IconButton label="Close" plain onClick={onClose}><CloseIcon /></IconButton>
          </div>
          <div className={cx("cd-drawer__body", flush && "cd-drawer__body--flush")}>{children}</div>
          {footer ? <div className="cd-drawer__foot">{footer}</div> : null}
        </aside>
      </div>
    </ThemedPortal>
  );
}

/* ---------------- Notifications (297:7421) ---------------- */
export interface NotificationItem {
  id: string;
  kind: "success" | "info" | "warning" | "danger";
  icon: ReactNode;
  title: ReactNode;
  text?: ReactNode;
  time: string;
  group: string; // "Today", "Yesterday"
  unread?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  category?: string;
}
export interface NotificationsPanelProps {
  items: NotificationItem[];
  categories?: TabItem[];
  activeCategory?: string;
  onCategoryChange?: (id: string) => void;
  onMarkAllRead?: () => void;
  onViewAll?: () => void;
  onSettings?: () => void;
  /** "Alert settings" icon */
  settingsIcon?: ReactNode;
  className?: string;
}
export function NotificationsPanel({
  items, categories, activeCategory = "all", onCategoryChange, onMarkAllRead, onViewAll, onSettings, settingsIcon, className,
}: NotificationsPanelProps) {
  const unread = items.filter((i) => i.unread).length;
  const groups: Array<[string, NotificationItem[]]> = [];
  items.forEach((i) => {
    const g = groups.find(([name]) => name === i.group);
    if (g) g[1].push(i); else groups.push([i.group, [i]]);
  });
  return (
    <div className={cx("cd-popover", className)} role="region" aria-label="Notifications" style={{ position: "static", width: "100%" }}>
      <div className="cd-notif__head">
        <div className="cd-notif__title">
          Notifications {unread ? <StatusBadge tone="danger" small>{unread} new</StatusBadge> : null}
        </div>
        {onMarkAllRead ? <button className="cd-link" type="button" onClick={onMarkAllRead}>Mark all read</button> : null}
      </div>
      {categories && onCategoryChange ? (
        <div className="cd-notif__tabs">
          <Tabs variant="pill" label="Notification categories" items={categories} value={activeCategory} onChange={onCategoryChange} />
        </div>
      ) : null}
      <ul className="cd-notif__list">
        {groups.map(([name, list]) => (
          <li key={name} style={{ listStyle: "none" }}>
            <div className="cd-notif__group">{name}</div>
            <ul className="cd-notif__list" style={{ maxHeight: "none", overflow: "visible" }}>
              {list.map((n) => (
                <li key={n.id} className="cd-notif__item" data-unread={n.unread || undefined}>
                  <span className={cx("cd-notif__icon", `cd-notif__icon--${n.kind}`)}>{n.icon}</span>
                  <div className="cd-notif__body">
                    <div className="cd-notif__top">
                      <span className="cd-notif__name">{n.title}</span>
                      <span className="cd-notif__time">{n.time}</span>
                      {n.unread ? <span className="cd-notif__dot" aria-label="Unread" /> : null}
                    </div>
                    {n.text ? <p className="cd-notif__text">{n.text}</p> : null}
                    {n.actionLabel ? <button type="button" className="cd-notif__action" onClick={n.onAction}>{n.actionLabel} →</button> : null}
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <div className="cd-notif__foot">
        <button type="button" className="cd-link" style={{ textDecoration: "none" }} onClick={onViewAll}>View all notifications</button>
        {onSettings ? <button type="button" className="cd-btn cd-btn--ghost" onClick={onSettings}>{settingsIcon}Alert settings</button> : null}
      </div>
    </div>
  );
}

/** Bell button + dropdown anchored under it (desktop) — render <NotificationsPanel/> as children. */
export function NotificationsMenu({ count, children }: { count?: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, [open]);
  return (
    <div className="cd-popover-anchor" ref={ref}>
      <IconButton label={`Notifications${count ? `, ${count} unread` : ""}`} dot={!!count} aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => setOpen((o) => !o)}>
        <BellIcon />
      </IconButton>
      {open ? <div className="cd-popover" id={id}>{children}</div> : null}
    </div>
  );
}

/* ---------------- Toast ---------------- */
export function ToastRegion({ messages }: { messages: Array<{ id: string; text: ReactNode; icon?: ReactNode }> }) {
  return (
    <div className="cd-toast-region" role="status" aria-live="polite">
      {messages.map((m) => <div key={m.id} className="cd-toast">{m.icon}{m.text}</div>)}
    </div>
  );
}
