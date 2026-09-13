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
import { SearchSuggestions } from "@/components/shared/search-suggestions";
import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * Search entry point in the header. Desktop opens a centered Modal
 * (Dialog); mobile opens a bottom Drawer instead — same content, the more
 * natural pattern for each form factor. Typing shows live suggestions
 * (jump straight to a product); submitting instead navigates to the shop
 * grid filtered by that search term.
 */
export function SearchTrigger() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  function close() {
    setOpen(false);
    setQuery("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    close();
    router.push(`/shop${params.size ? `?${params.toString()}` : ""}`);
  }

  const form = (
    <div>
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
      <SearchSuggestions query={query} onNavigate={close} />
    </div>
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
        <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Search Products</DialogTitle>
            </DialogHeader>
            {form}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
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
