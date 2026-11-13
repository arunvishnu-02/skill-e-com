import { useMemo, useState } from "react";
import {
  AlertIcon, Button, CardGrid, ChartCard, ChevronDownIcon, DashboardBreadcrumb, DashboardCard, DashboardHeader,
  DashboardLayout, DashboardSidebar, DataTable, FormField, FormGrid, KpiGrid, MenuIcon, MobileHeader, MobileTabBar, Modal,
  NotificationsMenu, NotificationsPanel, ProgressList, BarChart, SearchInput, SettingsIcon, SidebarPromo, Stack, StatCard,
  StatusBadge, Tabs, TextArea, TextInput, ThemeProvider, Toggle, UploadIcon, ChoiceGroup, Select, FilterBar, RowMenu,
  CheckCircleIcon, InboxIcon, EmptyState, Chip, type NavItem, type StatusTone, type Column,
} from "@dashboard-kit/ui";
import { categories, inr, orders, recent, sales, type Order } from "./data/sample";
import { themes, type ThemeKey } from "./themes";

/* Inline icons used by the demo nav (clients bring their own icon set). */
const ic = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
const icons = {
  home: ic("m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"),
  orders: ic("M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"),
  tag: ic("M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8zM7 7h.01"),
  box: ic("M21 8 12 3 3 8v8l9 5 9-5zM3.3 7.5 12 12.5l8.7-5M12 22V12.5"),
  users: ic("M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"),
  truck: ic("M1 3h15v13H1zM16 8h4l3 3v5h-7zM5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5M18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"),
  chart: ic("M3 3v18h18M18 17V9M13 17V5M8 17v-3"),
  logout: ic("M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"),
};

const NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", mobileLabel: "Home", href: "#dashboard", icon: icons.home, mobile: true },
  { id: "orders", label: "Orders", href: "#orders", icon: icons.orders, badge: 12, mobile: true },
  { id: "products", label: "Products", href: "#products", icon: icons.tag, mobile: true },
  { id: "inventory", label: "Inventory", href: "#inventory", icon: icons.box, badge: 14, badgeTone: "danger" },
  { id: "customers", label: "Customers", href: "#customers", icon: icons.users },
  { id: "wholesale", label: "Wholesale enquiries", mobileLabel: "Enquiries", href: "#wholesale", icon: icons.truck, badge: 9, mobile: true },
  { id: "reports", label: "Reports", href: "#reports", icon: icons.chart },
];
const BOTTOM: NavItem[] = [
  { id: "settings", label: "Settings", href: "#settings", icon: <SettingsIcon /> },
  { id: "logout", label: "Log out", icon: icons.logout, onClick: () => undefined },
];

const statusTone: Record<Order["status"], StatusTone> = {
  Processing: "warning", Wholesale: "brand", Shipped: "info", Delivered: "success", Cancelled: "danger",
};

function useHashPage() {
  const read = () => (location.hash.replace("#", "") || "dashboard");
  const [page, setPage] = useState(read);
  window.onhashchange = () => setPage(read());
  return page;
}

export function App() {
  const params = new URLSearchParams(location.search);
  const [themeKey, setThemeKey] = useState<ThemeKey>((params.get("theme") as ThemeKey) || "ak57");
  const page = useHashPage();
  const theme = themes[themeKey];
  const [range, setRange] = useState("7d");
  const [restock, setRestock] = useState(false);
  const [qty, setQty] = useState(12);
  const [notifTab, setNotifTab] = useState("all");
  const [orderTab, setOrderTab] = useState("all");
  const [variantType, setVariantType] = useState<"single" | "variants">("single");
  const [draft, setDraft] = useState(true);
  const [topSelling, setTopSelling] = useState(false);

  const brand = useMemo(() => ({ name: theme.brandName, logo: "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 46'><rect width='40' height='46' rx='10' fill='${theme.primary}'/></svg>`) }), [theme]);

  const notifications = (
    <NotificationsPanel
      categories={[{ id: "all", label: "All", count: 5 }, { id: "orders", label: "Orders", count: 2 }, { id: "enq", label: "Enquiries", count: 1 }, { id: "stock", label: "Stock", count: 2 }]}
      activeCategory={notifTab}
      onCategoryChange={setNotifTab}
      onMarkAllRead={() => undefined}
      settingsIcon={<SettingsIcon />}
      items={[
        { id: "1", group: "Today", kind: "success", icon: icons.orders, title: "New order #AK1043", text: "Karthik R. · 2 items · Home delivery", time: "10:42 AM", unread: true, actionLabel: "View order" },
        { id: "2", group: "Today", kind: "info", icon: icons.truck, title: "Wholesale enquiry #WE109", text: "Sri Balaji Textiles · Shirt & Vesti Combo · 50–199 pcs", time: "11:20 AM", unread: true, actionLabel: "Send quote" },
        { id: "3", group: "Today", kind: "warning", icon: <AlertIcon />, title: "Low stock", text: "Premium Men’s Shirt and Vesti Combo · Light Blue M · 2 left", time: "9:15 AM", unread: true, actionLabel: "Restock" },
        { id: "4", group: "Yesterday", kind: "danger", icon: <AlertIcon />, title: "Out of stock", text: "Men’s Baggy Jean · 32 · hidden from the website", time: "6:10 PM" },
      ]}
    />
  );

  const headerActions = (
    <>
      <SearchInput placeholder="Search orders, products…" />
      <NotificationsMenu count={3}>{notifications}</NotificationsMenu>
    </>
  );

  type Recent = (typeof recent)[number];
  const columns: Array<Column<Recent>> = [
    { id: "order", header: "Order", width: 100, cell: (o) => <strong>{o.id}</strong> },
    { id: "customer", header: "Customer", cell: (o) => o.customer },
    { id: "items", header: "Items", width: 60, cell: (o) => o.items },
    { id: "amount", header: "Amount", width: 100, cell: (o) => <strong>{inr(o.amount)}</strong> },
    { id: "payment", header: "Payment", width: 90, cell: (o) => <span style={{ color: "var(--cd-text-secondary)" }}>{o.payment}</span> },
  ];

  let content;
  let active = "dashboard";
  if (page === "orders") {
    active = "orders";
    content = (
      <>
        <DashboardHeader title="Orders" subtitle="248 orders this month · Wed, 21 Oct 2026" actions={<>{headerActions}<Button variant="secondary">+ New order</Button></>} />
        <FilterBar
          tabs={<Tabs label="Order status" value={orderTab} onChange={setOrderTab} items={[{ id: "all", label: "All", count: 248 }, { id: "processing", label: "Processing", count: 12 }, { id: "shipped", label: "Shipped", count: 34 }, { id: "delivered", label: "Delivered", count: 190 }, { id: "wholesale", label: "Wholesale", count: 9 }, { id: "cancelled", label: "Cancelled", count: 3 }]} />}
          actions={<><Button>Newest first <ChevronDownIcon width={14} height={14} /></Button><Button>Last 30 days</Button></>}
        />
        <DashboardCard flush>
          <DataTable
            density="full"
            caption="Orders"
            rows={orders}
            rowKey={(o) => o.id}
            highlightRow={(o) => o.id === "#AK1043"}
            groupBy={() => ({ id: "oct", label: "October 2026", meta: "248 orders · ₹2,84,600" })}
            columns={[
              { id: "order", header: "Order", cell: (o) => <div className="cd-cell-stack"><span>{o.id}</span><span>{o.date}</span></div> },
              { id: "customer", header: "Customer", cell: (o) => <div className="cd-cell-stack"><span>{o.customer}</span><span>{o.phone}</span></div> },
              { id: "products", header: "Products", cell: (o) => <div className="cd-cell-stack"><span style={{ fontWeight: 500, fontSize: 13 }}>{o.product}</span>{o.more ? <span>{o.more}</span> : null}</div> },
              { id: "delivery", header: "Delivery", cell: (o) => <div className="cd-cell-stack"><span style={{ fontWeight: 500, fontSize: 13 }}>{o.delivery}</span><span>{o.city}</span></div> },
              { id: "items", header: "Items", cell: (o) => o.items },
              { id: "amount", header: "Amount", cell: (o) => <strong>{inr(o.amount)}</strong> },
              { id: "status", header: "Status", cell: (o) => <StatusBadge tone={statusTone[o.status]}>{o.status}</StatusBadge> },
              { id: "more", header: "", width: 40, cell: () => <RowMenu actions={[{ id: "view", label: "View order", onSelect: () => undefined }, { id: "cancel", label: "Cancel order", danger: true, onSelect: () => undefined }]} /> },
            ]}
            footer="Showing 5 of 248 · scroll down to load more"
          />
        </DashboardCard>
      </>
    );
  } else if (page === "products") {
    active = "products";
    content = (
      <>
        <DashboardHeader title="Add product" breadcrumb={<DashboardBreadcrumb items={[{ label: "Products", href: "#products" }, { label: "New product" }]} />} actions={headerActions} />
        <CardGrid layout="main-aside">
          <Stack>
            <DashboardCard title="Basic details" className="cd-card--tight">
              <FormField label="Product name">{(a) => <TextInput {...a} placeholder="e.g. Premium Korean Style Men's Shirt" />}</FormField>
              <FormField label="Product type">
                <ChoiceGroup label="Product type" value={variantType} onChange={setVariantType} options={[{ value: "single", title: "Single product", hint: "One price and one stock count" }, { value: "variants", title: "Product with variants", hint: "Sizes, colours or other attributes" }]} />
              </FormField>
              <FormGrid>
                <FormField label="Brand">{(a) => <TextInput {...a} defaultValue="AK" />}</FormField>
                <FormField label="URL slug">{(a) => <TextInput {...a} placeholder="shop/product/ (filled from the name)" />}</FormField>
              </FormGrid>
              <FormField label="Short description" hint="Shown under the price on the product page · max 160 characters">{(a) => <TextArea {...a} placeholder="One or two lines shown under the price." />}</FormField>
            </DashboardCard>
            <DashboardCard title="Images">
              <button type="button" className="cd-upload"><UploadIcon /><span className="cd-upload__title">Drop photos or browse</span><span className="cd-upload__hint">JPG / PNG · up to 5 MB</span></button>
            </DashboardCard>
          </Stack>
          <Stack>
            <Button variant="secondary" size="lg" block>Publish product</Button>
            <DashboardCard title="Status" className="cd-card--tight">
              <Toggle label="Draft" hint="Not visible until you publish" checked={draft} onChange={setDraft} />
              <Toggle label="Show in “Top selling”" hint="Home page best sellers" checked={topSelling} onChange={setTopSelling} />
              <Button block>Preview on store</Button>
            </DashboardCard>
            <DashboardCard title="Organisation" className="cd-card--tight">
              <FormField label="Category">{(a) => <Select {...a}><option>Choose a category</option><option>Shirts</option></Select>}</FormField>
              <FormField label="Tags">{(a) => <TextInput {...a} placeholder="Type a tag and press Enter" />}</FormField>
            </DashboardCard>
          </Stack>
        </CardGrid>
      </>
    );
  } else if (page === "inventory") {
    active = "inventory";
    content = (
      <>
        <DashboardHeader title="Inventory" subtitle="Stock by size and colour · updated 2 min ago" actions={headerActions} />
        <DashboardCard flush>
          <DataTable caption="Low stock" density="full" rows={orders.slice(0, 3)} rowKey={(o) => o.id}
            columns={[{ id: "p", header: "Product", cell: (o) => o.product }, { id: "s", header: "Stock", cell: (o) => o.items }, { id: "a", header: "", cell: () => <Button size="sm" onClick={() => setRestock(true)}>+ Restock</Button> }]} />
        </DashboardCard>
        <Modal open={restock} onClose={() => setRestock(false)} title="Restock" subtitle="Premium Men's Shirt and Vesti Combo · Silver · XL"
          actions={<><Button onClick={() => setRestock(false)}>Cancel</Button><Button variant="primary" onClick={() => setRestock(false)}>Add {qty} pcs</Button></>}>
          <div className="cd-callout"><span>Now in stock</span><strong style={{ color: "var(--cd-danger)" }}>0</strong></div>
          <FormField label="How many pieces to add?">{(a) => <TextInput {...a} type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} />}</FormField>
          <div className="cd-chips">{[5, 10, 20, 50].map((n) => <Chip key={n} onClick={() => setQty((q) => q + n)}>+{n}</Chip>)}</div>
        </Modal>
      </>
    );
  } else if (page === "states") {
    active = "dashboard";
    content = (
      <>
        <DashboardHeader title="States" subtitle="Loading, empty, error and success (derived, not in Figma)" />
        <KpiGrid><StatCard label="Loading…" value="—" /><StatCard label="Orders today" value="0" delta={{ value: "0", trend: "neutral" }} note="no change" /></KpiGrid>
        <CardGrid layout="2-1">
          <ChartCard title="Sales — last 7 days" loading><></></ChartCard>
          <ChartCard title="Top categories" error="The reports service didn’t respond."><></></ChartCard>
        </CardGrid>
        <DashboardCard><EmptyState icon={<InboxIcon />} title="No orders yet" text="New orders will show up here as customers check out." actions={<Button variant="secondary">Add product</Button>} /></DashboardCard>
        <DashboardCard><EmptyState tone="success" icon={<CheckCircleIcon />} title="All caught up" text="Nothing needs your attention." /></DashboardCard>
      </>
    );
  } else {
    content = (
      <>
        <DashboardHeader
          hideOnMobile
          title="Good evening, Arun 👋"
          subtitle={`Here’s how ${theme.brandName} is doing today · Tue, 13 Oct 2026`}
          actions={<>{headerActions}<Button variant="secondary" icon={<span aria-hidden>+</span>}>Add product</Button></>}
        />
        <KpiGrid>
          <StatCard featured label="Today’s revenue" value="₹48,250" delta={{ value: "+12.4%" }} note="vs yesterday" />
          <StatCard label="Orders today" value="132" delta={{ value: "+8" }} note="vs yesterday" />
          <StatCard label="Wholesale enquiries" value="9" delta={{ value: "3 new" }} note="awaiting reply" />
          <StatCard label="Low stock items" value="14" delta={{ value: "-4", trend: "down" }} note="restock needed" />
        </KpiGrid>
        <CardGrid layout="2-1">
          <ChartCard title="Sales — last 7 days" subtitle="₹2,84,600 total · all sales"
            actions={<Tabs variant="segmented" label="Range" value={range} onChange={setRange} items={[{ id: "7d", label: "7D" }, { id: "30d", label: "30D" }, { id: "90d", label: "90D" }]} />}>
            <BarChart ariaLabel="Sales for the last 7 days" data={sales.map((s, i) => ({ ...s, tooltip: i === 6 ? { title: "Tue · ₹48,250", detail: "Today · 32 orders" } : undefined }))} activeIndex={6} />
          </ChartCard>
          <DashboardCard title="Top categories"><ProgressList items={categories} /></DashboardCard>
        </CardGrid>
        <DashboardCard title="Recent orders" actions={<Button variant="ghost">Export</Button>} flush>
          <div style={{ padding: "0 24px 12px" }}>
            <DataTable caption="Recent orders" columns={columns} rows={recent} rowKey={(o) => o.id} mobileCard={(o) => (
              <><div className="cd-list__body"><span className="cd-list__title">{o.id}</span><span className="cd-list__text">{o.customer} · {o.items} items · {o.payment}</span></div><div className="cd-list__end">{inr(o.amount)}</div></>
            )} />
          </div>
        </DashboardCard>
      </>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <DashboardLayout
        sidebar={<DashboardSidebar brand={brand} items={NAV} bottomItems={BOTTOM} activeId={active}
          footer={<SidebarPromo title="Store is live" text="shop.example.com" action={<Button variant="primary" size="sm" block>View store</Button>} />} />}
        mobileHeader={<MobileHeader brand={brand} title="Good evening, Arun" subtitle={`Here's ${theme.brandName} today · Wed, 21 Oct 2026`} notificationCount={3} onNotificationsClick={() => undefined} />}
        mobileTabBar={<MobileTabBar activeId={active} items={NAV.filter((n) => n.mobile)} more={{ icon: <MenuIcon />, onClick: () => undefined }} />}
      >
        {content}
        {/* Theme switcher: demo only */}
        <div style={{ position: "fixed", top: 8, right: 8, zIndex: 2000, display: params.has("noswitch") ? "none" : "flex", gap: 6, opacity: 0.9 }} data-testid="theme-switcher">
          {(Object.keys(themes) as ThemeKey[]).map((k) => (
            <button key={k} className="cd-chip" aria-pressed={k === themeKey} onClick={() => setThemeKey(k)}>{themes[k].brandName}</button>
          ))}
        </div>
      </DashboardLayout>
    </ThemeProvider>
  );
}
