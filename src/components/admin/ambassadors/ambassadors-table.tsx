"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PublishToggle } from "@/components/admin/publish-toggle";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  deleteAmbassadorAction,
  setAmbassadorPublishedAction,
} from "@/lib/actions/admin-ambassadors";
import type { Ambassador } from "@/types";

export function AmbassadorsTable({ ambassadors }: { ambassadors: Ambassador[] }) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ambassador</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ambassadors.map((ambassador) => (
            <TableRow key={ambassador.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {ambassador.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ambassador.photo}
                      alt=""
                      className="size-9 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="size-9 shrink-0 rounded-full bg-surface-1" />
                  )}
                  <p className="font-medium text-foreground">{ambassador.name}</p>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{ambassador.role}</TableCell>
              <TableCell>
                <PublishToggle
                  published={ambassador.published}
                  onToggle={(next) => setAmbassadorPublishedAction(ambassador.id, next)}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button asChild variant="ghost" size="icon-sm" aria-label="Edit ambassador">
                    <Link href={`/admin/ambassadors/${ambassador.id}/edit`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <ConfirmDialog
                    trigger={
                      <Button variant="ghost" size="icon-sm" aria-label="Delete ambassador">
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    }
                    title="Delete this ambassador?"
                    description={`"${ambassador.name}" will be permanently removed.`}
                    confirmLabel="Delete"
                    onConfirm={() => deleteAmbassadorAction(ambassador.id)}
                    onSuccess={() => router.refresh()}
                    successMessage="Ambassador deleted"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
