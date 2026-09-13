"use client";

import { useRouter } from "next/navigation";
import { Pencil, Trash2, GripVertical } from "lucide-react";
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
import { CategoryFormDialog } from "@/components/admin/categories/category-form-dialog";
import {
  deleteCategoryAction,
  setCategoryPublishedAction,
} from "@/lib/actions/admin-categories";
import type { Category } from "@/types";

export function CategoriesTable({ categories }: { categories: Category[] }) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10" />
            <TableHead>Category</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Sort Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <GripVertical className="size-4 text-muted-foreground/50" />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  {category.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={category.image}
                      alt=""
                      className="size-9 shrink-0 rounded-md object-cover"
                    />
                  ) : (
                    <div className="size-9 shrink-0 rounded-md bg-surface-1" />
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{category.name}</p>
                    {category.description && (
                      <p className="truncate text-xs text-muted-foreground">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{category.slug}</TableCell>
              <TableCell className="text-muted-foreground">{category.sortOrder}</TableCell>
              <TableCell>
                <PublishToggle
                  published={category.published}
                  onToggle={(next) => setCategoryPublishedAction(category.id, next)}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <CategoryFormDialog
                    category={category}
                    trigger={
                      <Button variant="ghost" size="icon-sm" aria-label="Edit category">
                        <Pencil className="size-4" />
                      </Button>
                    }
                  />
                  <ConfirmDialog
                    trigger={
                      <Button variant="ghost" size="icon-sm" aria-label="Delete category">
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    }
                    title="Delete this category?"
                    description={`"${category.name}" will be permanently removed. Products already assigned to it keep their category value.`}
                    confirmLabel="Delete"
                    onConfirm={() => deleteCategoryAction(category.id)}
                    onSuccess={() => router.refresh()}
                    successMessage="Category deleted"
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
