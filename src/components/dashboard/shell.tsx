"use client";

import Image from "next/image";
import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";

import { logout } from "@/app/login/actions";
import {
  AccountIcon,
  CloseIcon,
  ExternalIcon,
  InboxIcon,
  JournalIcon,
  MenuIcon,
  OrdersIcon,
  OverviewIcon,
  ProductsIcon,
  SignOutIcon,
} from "@/components/dashboard/icons";
import { brand, site } from "@/config/site";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  /** Overview would otherwise light up on every nested dashboard route. */
  exact?: boolean;
  badge?: "messages" | "orders";
};

type NavGroup = { title: string; items: NavItem[] };

const groups: NavGroup[] = [
  {
    title: "Workshop",
    items: [{ href: "/dashboard", label: "Overview", icon: OverviewIcon, exact: true }],
  },
  {
    title: "Trade",
    items: [
      { href: "/dashboard/orders", label: "Orders", icon: OrdersIcon, badge: "orders" },
      { href: "/dashboard/messages", label: "Inbox", icon: InboxIcon, badge: "messages" },
    ],
  },
  {
    title: "Bench",
    items: [
      { href: "/dashboard/products", label: "Products", icon: ProductsIcon },
      { href: "/dashboard/posts", label: "Journal", icon: JournalIcon },
    ],
  },
];

const accountItem: NavItem = {
  href: "/dashboard/account",
  label: "Account",
  icon: AccountIcon,
};

const allItems = [...groups.flatMap((group) => group.items), accountItem];

function isActive(item: NavItem, pathname: string) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

/** The label for whichever section we are in — the small-screen page title. */
function sectionLabel(pathname: string) {
  const match = allItems
    .filter((item) => isActive(item, pathname))
    // Prefer the deepest match, so /dashboard/orders beats /dashboard.
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.label ?? "Workshop";
}

/**
 * A hairline that fills while the route a link points at is being fetched.
 * It starts invisible and animates in after 120ms, so prefetched navigations
 * — which land well inside that — never flash it.
 */
function NavPending() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return (
    <span
      aria-hidden="true"
      className="nav-pending pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gold"
    />
  );
}

function NavLink({
  item,
  active,
  badge,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  badge: number;
  onNavigate?: () => void;
}) {
  const Glyph = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 border-l-2 py-2.5 pl-4 pr-3 text-[12px] uppercase tracking-[0.14em] transition-colors",
        active
          ? "border-gold bg-ink/6 text-ink"
          : "border-transparent text-muted hover:border-ink/20 hover:bg-ink/4 hover:text-ink",
      )}
    >
      <Glyph
        className={cn(
          "size-[18px] shrink-0 transition-colors",
          active ? "text-gold" : "text-faint group-hover:text-gold",
        )}
      />
      <span className="flex-1 truncate">{item.label}</span>
      {badge > 0 ? (
        <span className="flex min-w-5 items-center justify-center bg-gold px-1.5 py-0.5 text-[10px] leading-none text-paper lining-nums tabular-nums">
          {badge > 99 ? "99+" : badge}
        </span>
      ) : null}
      <NavPending />
    </Link>
  );
}

function SidebarBody({
  name,
  email,
  newMessages,
  newOrders,
  onNavigate,
}: {
  name: string;
  email: string;
  newMessages: number;
  newOrders: number;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const badgeFor = (item: NavItem) =>
    item.badge === "messages" ? newMessages : item.badge === "orders" ? newOrders : 0;

  return (
    <div className="flex h-full flex-col">
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="flex shrink-0 items-center gap-3 border-b border-ink/10 px-5 py-5"
      >
        <Image
          src={brand.logo.mark}
          alt=""
          width={40}
          height={36}
          sizes="40px"
          priority
          className="h-8 w-auto"
        />
        <span className="flex flex-col leading-tight">
          <span className="font-serif text-lg">{site.name}</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-faint">Workshop</span>
        </span>
      </Link>

      <nav aria-label="Dashboard" className="flex-1 overflow-y-auto py-5">
        {groups.map((group) => (
          <div key={group.title} className="mb-5 last:mb-0">
            <h2 className="px-5 pb-2 text-[10px] uppercase tracking-[0.22em] text-faint">
              {group.title}
            </h2>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <NavLink
                    item={item}
                    active={isActive(item, pathname)}
                    badge={badgeFor(item)}
                    onNavigate={onNavigate}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-ink/10 py-3">
        <NavLink
          item={accountItem}
          active={isActive(accountItem, pathname)}
          badge={0}
          onNavigate={onNavigate}
        />
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 border-l-2 border-transparent py-2.5 pl-4 pr-3 text-[12px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-ink/20 hover:bg-ink/4 hover:text-ink"
        >
          <ExternalIcon className="size-[18px] shrink-0 text-faint transition-colors group-hover:text-gold" />
          <span className="flex-1 truncate">View site</span>
        </a>
      </div>

      <div className="flex shrink-0 items-center gap-3 border-t border-ink/10 px-5 py-4">
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center bg-ink font-serif text-[15px] text-paper"
        >
          {(name || email).trim().charAt(0).toUpperCase()}
        </span>
        <span className="flex min-w-0 flex-1 flex-col leading-tight">
          <span className="truncate text-[13px] text-ink">{name || email}</span>
          <span className="truncate text-[11px] text-faint">{email}</span>
        </span>
      </div>
    </div>
  );
}

export function DashboardShell({
  name,
  email,
  newMessages,
  newOrders,
  children,
}: {
  name: string;
  email: string;
  newMessages: number;
  newOrders: number;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  // Close on navigation. The links call `close` themselves, but this also
  // covers the back button and redirects out of a server action. Adjusting
  // during render rather than in an effect: React restarts the render before
  // committing, so the drawer never paints open on the new route.
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setOpen(false);
  }

  // Lock the page behind the drawer, move focus into it, let Escape out.
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        openerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const sidebar = (onNavigate?: () => void) => (
    <SidebarBody
      name={name}
      email={email}
      newMessages={newMessages}
      newOrders={newOrders}
      onNavigate={onNavigate}
    />
  );

  return (
    <div className="min-h-dvh bg-parchment lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <a
        href="#dashboard-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-60 focus:bg-ink focus:px-4 focus:py-2 focus:text-[12px] focus:uppercase focus:tracking-[0.18em] focus:text-paper"
      >
        Skip to content
      </a>

      {/* ----------------------------------------------- permanent sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-0 h-dvh border-r border-ink/12 bg-paper">{sidebar()}</div>
      </div>

      {/* -------------------------------------------------- mobile drawer */}
      <div
        className={cn("fixed inset-0 z-50 lg:hidden", !open && "pointer-events-none")}
        inert={!open || undefined}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-ink/45 transition-opacity duration-200",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          role="dialog"
          aria-modal={open || undefined}
          aria-label="Dashboard navigation"
          className={cn(
            "absolute inset-y-0 left-0 flex w-[17rem] max-w-[85vw] flex-col bg-paper shadow-2xl transition-transform duration-200 ease-out",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="absolute right-3 top-5 z-10 p-2 text-muted transition-colors hover:text-gold"
          >
            <CloseIcon className="size-5" />
          </button>
          {sidebar(() => setOpen(false))}
        </div>
      </div>

      {/* ---------------------------------------------------------- column */}
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-40 flex items-center gap-2 border-b border-ink/12 bg-paper/95 px-3 py-2.5 backdrop-blur-sm lg:hidden">
          <button
            ref={openerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-label="Open navigation"
            className="relative flex items-center p-2 text-ink transition-colors hover:text-gold"
          >
            <MenuIcon className="size-6" />
            {newMessages + newOrders > 0 ? (
              <span
                className="absolute right-1 top-1 size-1.5 bg-gold"
                aria-hidden="true"
              />
            ) : null}
          </button>

          <span className="min-w-0 flex-1 truncate text-[11px] uppercase tracking-[0.2em] text-muted">
            {sectionLabel(pathname)}
          </span>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View site"
            className="flex items-center p-2 text-muted transition-colors hover:text-gold"
          >
            <ExternalIcon className="size-5" />
          </a>

          <form action={logout}>
            <button
              type="submit"
              aria-label="Sign out"
              className="flex items-center p-2 text-muted transition-colors hover:text-gold"
            >
              <SignOutIcon className="size-5" />
            </button>
          </form>
        </header>

        <main
          id="dashboard-main"
          className="w-full max-w-[1280px] flex-1 px-4 py-7 sm:px-6 sm:py-9 lg:px-10 lg:py-11"
        >
          {children}
        </main>

        {/* Sign out sits at the end of the desktop column rather than in the
            sidebar footer, which the account card already fills. */}
        <div className="hidden border-t border-ink/12 px-10 py-4 lg:block">
          <form action={logout}>
            <button
              type="submit"
              className="group flex items-center gap-2.5 text-[11px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-gold"
            >
              <SignOutIcon className="size-4 text-faint transition-colors group-hover:text-gold" />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
