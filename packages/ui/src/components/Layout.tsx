import type { ElementType, ReactNode } from "react";
import { cx } from "./utils";
import { BellIcon } from "../icons";

/* ------------------------------------------------------------------ */
/* Navigation config — business modules are data, not markup.         */
/* ------------------------------------------------------------------ */
export interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  /** Count badge (e.g. pending orders). */
  badge?: number | string;
  badgeTone?: "neutral" | "danger";
  /** Hide the item for users without this permission (checked by `canAccess`). */
  permission?: string;
  /** Show in the mobile bottom tab bar (max 4 + "More"). */
  mobile?: boolean;
  /** Shorter label for the mobile tab bar (Figma: "Home", "Enquiries"). */
  mobileLabel?: string;
  onClick?: () => void;
}

export interface BrandProps {
  name: string;
  logo?: string;
  /** Small caps tag under the name. Master: "ADMIN PANEL". */
  tagline?: string;
  href?: string;
}

/** Router-agnostic link: pass your router's Link (Next.js, React Router) via `linkAs`. */
export type LinkComponent = ElementType<{ href?: string; to?: string; className?: string; children?: ReactNode; "aria-current"?: "page" }>;

function Brand({ name, logo, tagline = "Admin panel", href = "/" , linkAs: Link = "a", className }: BrandProps & { linkAs?: LinkComponent; className?: string }) {
  return (
    <Link href={href} to={href} className={className}>
      {logo ? <img className="cd-sidebar__logo" src={logo} alt="" /> : null}
      <span className="cd-sidebar__brand-text">
        <span className="cd-sidebar__brand-name">{name}</span>
        {tagline ? <span className="cd-sidebar__brand-tag">{tagline}</span> : null}
      </span>
    </Link>
  );
}

function NavLink({ item, active, linkAs: Link = "a" }: { item: NavItem; active: boolean; linkAs?: LinkComponent }) {
  const content = (
    <>
      {item.icon ? <span className="cd-nav-item__icon">{item.icon}</span> : null}
      <span className="cd-nav-item__label">{item.label}</span>
      {item.badge !== undefined && item.badge !== 0 ? (
        <span className={cx("cd-nav-item__badge", item.badgeTone === "danger" && "cd-nav-item__badge--danger")}>
          {item.badge}
        </span>
      ) : null}
    </>
  );
  if (!item.href) {
    return (
      <button type="button" className="cd-nav-item" aria-current={active ? "page" : undefined} onClick={item.onClick} title={item.label}>
        {content}
      </button>
    );
  }
  return (
    <Link href={item.href} to={item.href} className="cd-nav-item" aria-current={active ? "page" : undefined}>
      {content}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
export interface DashboardSidebarProps {
  brand: BrandProps;
  items: NavItem[];
  /** Pinned to the bottom (Settings, Log out). */
  bottomItems?: NavItem[];
  activeId?: string;
  /** Slot under bottom items, e.g. "Store is live" card. */
  footer?: ReactNode;
  linkAs?: LinkComponent;
  canAccess?: (permission: string) => boolean;
  "aria-label"?: string;
}

export function DashboardSidebar({
  brand, items, bottomItems = [], activeId, footer, linkAs, canAccess = () => true, ...rest
}: DashboardSidebarProps) {
  const visible = (i: NavItem) => !i.permission || canAccess(i.permission);
  return (
    <nav className="cd-sidebar" aria-label={rest["aria-label"] ?? "Main"}>
      <Brand {...brand} linkAs={linkAs} className="cd-sidebar__brand" />
      <div className="cd-sidebar__divider" />
      <ul className="cd-sidebar__nav">
        {items.filter(visible).map((item) => (
          <li key={item.id}><NavLink item={item} active={item.id === activeId} linkAs={linkAs} /></li>
        ))}
      </ul>
      <div className="cd-sidebar__spacer" />
      {bottomItems.length ? (
        <ul className="cd-sidebar__nav-bottom">
          {bottomItems.filter(visible).map((item) => (
            <li key={item.id}><NavLink item={item} active={item.id === activeId} linkAs={linkAs} /></li>
          ))}
        </ul>
      ) : null}
      {footer}
    </nav>
  );
}

/** "Store is live" style promo card at the sidebar foot (297:956). */
export function SidebarPromo({ title, text, action }: { title: ReactNode; text?: ReactNode; action?: ReactNode }) {
  return (
    <div className="cd-sidebar__promo">
      <p className="cd-sidebar__promo-title">{title}</p>
      {text ? <p className="cd-sidebar__promo-text">{text}</p> : null}
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ */
export interface DashboardHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Rendered above the title (e.g. <DashboardBreadcrumb/>). Replaces subtitle position in Figma "Add product". */
  breadcrumb?: ReactNode;
  actions?: ReactNode;
  /** Hide on mobile when <MobileHeader/> already shows the greeting (dashboard home). */
  hideOnMobile?: boolean;
}

export function DashboardHeader({ title, subtitle, breadcrumb, actions, hideOnMobile }: DashboardHeaderProps) {
  return (
    <header className={cx("cd-header", hideOnMobile && "cd-header--hide-mobile")}>
      <div className="cd-header__titles">
        <h1 className="cd-header__title">{title}</h1>
        {subtitle ? <p className="cd-header__subtitle">{subtitle}</p> : null}
        {breadcrumb}
      </div>
      {actions ? <div className="cd-header__actions">{actions}</div> : null}
    </header>
  );
}

export interface BreadcrumbItem { label: ReactNode; href?: string }
export function DashboardBreadcrumb({ items, linkAs: Link = "a" }: { items: BreadcrumbItem[]; linkAs?: LinkComponent }) {
  return (
    <nav className="cd-breadcrumb" aria-label="Breadcrumb">
      <ol>
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i}>
              {it.href && !last ? (
                <Link href={it.href} to={it.href}>{it.label}</Link>
              ) : (
                <span aria-current={last ? "page" : undefined}>{it.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
export interface MobileTabBarProps {
  items: NavItem[];
  activeId?: string;
  linkAs?: LinkComponent;
  /** Extra "More" tab, usually opens a Drawer with the remaining nav items. */
  more?: { label?: string; icon: ReactNode; onClick: () => void; active?: boolean };
}

export function MobileTabBar({ items, activeId, linkAs: Link = "a", more }: MobileTabBarProps) {
  return (
    <nav className="cd-tabbar" aria-label="Primary">
      {items.map((item) => {
        const active = item.id === activeId;
        const inner = (
          <>
            <span className="cd-tabbar__icon">{item.icon}</span>
            {item.mobileLabel ?? item.label}
            {item.badge ? <span className="cd-tabbar__badge">{item.badge}</span> : null}
          </>
        );
        return item.href ? (
          <Link key={item.id} href={item.href} to={item.href} className="cd-tabbar__item" aria-current={active ? "page" : undefined}>{inner}</Link>
        ) : (
          <button key={item.id} type="button" className="cd-tabbar__item" aria-current={active ? "page" : undefined} onClick={item.onClick}>{inner}</button>
        );
      })}
      {more ? (
        <button type="button" className="cd-tabbar__item" aria-current={more.active ? "page" : undefined} onClick={more.onClick}>
          <span className="cd-tabbar__icon">{more.icon}</span>
          {more.label ?? "More"}
        </button>
      ) : null}
    </nav>
  );
}

/** Dark mobile header (297:10143): brand + bell, then greeting. */
export function MobileHeader({
  brand, title, subtitle, notificationCount, onNotificationsClick, linkAs,
}: {
  brand: BrandProps; title?: ReactNode; subtitle?: ReactNode; notificationCount?: number; onNotificationsClick?: () => void; linkAs?: LinkComponent;
}) {
  return (
    <header className="cd-mobile-header">
      <div className="cd-mobile-header__bar">
        <Brand {...brand} linkAs={linkAs} className="cd-mobile-header__brand" />
        {onNotificationsClick ? (
          <button type="button" className="cd-icon-btn" onClick={onNotificationsClick} aria-label={`Notifications${notificationCount ? `, ${notificationCount} unread` : ""}`}>
            <BellIcon />
            {notificationCount ? <span className="cd-icon-btn__count">{notificationCount}</span> : null}
          </button>
        ) : null}
      </div>
      {title ? (
        <div className="cd-header__titles">
          <h1 className="cd-header__title">{title}</h1>
          {subtitle ? <p className="cd-header__subtitle">{subtitle}</p> : null}
        </div>
      ) : null}
    </header>
  );
}

/* ------------------------------------------------------------------ */
export interface DashboardLayoutProps {
  sidebar: ReactNode;
  /** Shown < 768px instead of the sidebar. */
  mobileHeader?: ReactNode;
  /** Shown < 768px, fixed to the bottom. */
  mobileTabBar?: ReactNode;
  children: ReactNode;
  /** Force the full sidebar on tablet widths (default: icon rail 768–1279). */
  sidebarExpanded?: boolean;
}

/**
 * Master shell (297:869): 251px ink sidebar + main column (32/28 padding, 24 gap).
 * Tablet: icon rail. Mobile: dark header + bottom tab bar (297:10142).
 */
export function DashboardLayout({ sidebar, mobileHeader, mobileTabBar, children, sidebarExpanded }: DashboardLayoutProps) {
  return (
    <div className="cd-layout" data-sidebar={sidebarExpanded ? "expanded" : undefined}>
      {sidebar}
      {mobileHeader ? <div className="cd-layout__mobile-header">{mobileHeader}</div> : null}
      <main className="cd-layout__main" id="cd-main">{children}</main>
      {mobileTabBar ? <div className="cd-layout__tabbar">{mobileTabBar}</div> : null}
    </div>
  );
}
