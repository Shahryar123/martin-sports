"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PRIMARY_NAV } from "@/lib/constants/nav";
import { SITE_CONFIG } from "@/lib/constants/site";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { CartButton } from "@/components/cart/cart-button";
import { SearchTrigger } from "@/components/layout/search-trigger";
import { CategoryNavMenu } from "@/components/layout/category-nav-menu";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";

// "Shop" is where the Categories dropdown is inserted in the desktop nav.
const CATEGORIES_ANCHOR = "/shop";

export function SiteHeader() {
  const scrolled = useScrolled();

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "theme-forest sticky top-0 z-40 border-b text-foreground transition-all duration-300",
        scrolled
          ? "border-border bg-background/70 shadow-sm shadow-black/20 backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:bg-background/55"
          : "border-transparent bg-[#112519]",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label={`${SITE_CONFIG.name} home`}
        >
          <Image
            src="/logo-shield.png"
            alt=""
            width={353}
            height={430}
            priority
            className="h-11 w-auto transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-display text-2xl leading-none font-extrabold italic tracking-wide text-foreground uppercase transition-colors group-hover:text-brand">
            {SITE_CONFIG.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {PRIMARY_NAV.map((item) => (
            <span key={item.href} className="contents">
              <Link
                href={item.href}
                className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-foreground-secondary transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
              {item.href === CATEGORIES_ANCHOR && <CategoryNavMenu />}
            </span>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <SearchTrigger />
          <CartButton />
          <div className="hidden lg:block">
            <WhatsAppButton size="sm" />
          </div>
          <MobileNav />
        </div>
      </div>
    </motion.header>
  );
}
