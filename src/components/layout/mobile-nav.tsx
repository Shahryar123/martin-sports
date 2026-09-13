"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PRIMARY_NAV } from "@/lib/constants/nav";
import { CATEGORIES } from "@/lib/constants/categories";
import { SITE_CONFIG } from "@/lib/constants/site";

const listVariants = {
  open: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
  closed: {},
};

const itemVariants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: -12 },
};

/**
 * Mobile navigation — a real touch-first menu (44px+ targets, categories in
 * an accordion rather than a hover dropdown, WhatsApp CTA pinned at the
 * bottom), not a shrunk copy of the desktop nav.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-11 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-sm">
        <SheetHeader>
          <SheetTitle className="font-heading text-lg">
            {SITE_CONFIG.name}
          </SheetTitle>
        </SheetHeader>

        <motion.nav
          initial="closed"
          animate={open ? "open" : "closed"}
          variants={listVariants}
          className="flex-1 overflow-y-auto px-4 pb-4"
        >
          <ul className="space-y-1">
            {PRIMARY_NAV.map((item) => (
              <motion.li key={item.href} variants={itemVariants}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center rounded-md px-3 text-base font-medium text-foreground transition-colors hover:bg-surface-2 active:bg-surface-2"
                >
                  {item.label}
                </Link>
              </motion.li>
            ))}
          </ul>

          <motion.div variants={itemVariants} className="mt-2">
            <Accordion type="single" collapsible>
              <AccordionItem value="categories" className="border-none">
                <AccordionTrigger className="min-h-12 rounded-md px-3 text-base font-medium hover:bg-surface-2 hover:no-underline">
                  Categories
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-0.5 pl-3">
                    {CATEGORIES.map((category) => (
                      <li key={category.slug}>
                        <Link
                          href={`/products?category=${category.slug}`}
                          onClick={() => setOpen(false)}
                          className="flex min-h-11 items-center rounded-md px-3 text-sm text-foreground-secondary transition-colors hover:bg-surface-2 hover:text-foreground active:bg-surface-2"
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </motion.nav>

        <div className="border-t border-border p-4">
          <WhatsAppButton className="w-full" size="lg" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
