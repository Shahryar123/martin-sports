"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import type { ActionResult } from "@/lib/actions/types";

type PublishToggleProps = {
  published: boolean;
  onToggle: (next: boolean) => Promise<ActionResult<unknown>>;
};

/** Clickable published/draft badge — flips status via a server action
 * without leaving the list page. Used by categories and ambassadors. */
export function PublishToggle({ published, onToggle }: PublishToggleProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await onToggle(!published);
      if (!result.success) toast.error(result.error);
      else router.refresh();
    });
  }

  return (
    <button type="button" onClick={handleClick} disabled={isPending} className="cursor-pointer">
      <Badge variant={published ? "success" : "outline"}>
        {isPending ? "Updating…" : published ? "Published" : "Draft"}
      </Badge>
    </button>
  );
}
