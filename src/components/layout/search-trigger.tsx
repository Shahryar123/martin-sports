"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * Search entry point in the header. Desktop opens a centered Modal
 * (Dialog); mobile opens a bottom Drawer instead — same content, the more
 * natural pattern for each form factor. Submitting navigates to the
 * products listing with a `search` query param; the listing itself already
 * reads that param (see products/page.tsx) — building the actual
 * filter/sort UI is a later phase.
 */
export function SearchTrigger() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOpen(false);
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    router.push(`/products${params.size ? `?${params.toString()}` : ""}`);
  }

  const form = (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search cricket bats, gloves, pads…"
        aria-label="Search products"
      />
      <Button type="submit" size="default">
        <Search className="size-4" />
        Search
      </Button>
    </form>
  );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Search products"
        onClick={() => setOpen(true)}
        className="size-9"
      >
        <Search className="size-[18px]" />
      </Button>

      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Search Products</DialogTitle>
            </DialogHeader>
            {form}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Search Products</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-6">{form}</div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
