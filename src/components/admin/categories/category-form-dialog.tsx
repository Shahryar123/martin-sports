"use client";

import { useEffect, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ImageOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { categoryFormSchema, type CategoryFormValues } from "@/lib/validations/category";
import { createCategoryAction, updateCategoryAction } from "@/lib/actions/admin-categories";
import { slugify } from "@/lib/utils";
import type { Category } from "@/types";

type CategoryFormDialogProps = {
  trigger: ReactNode;
  category?: Category;
  nextSortOrder?: number;
};

/** Small live preview for an admin-entered image path/URL — there's no file
 * upload, so this catches a typo'd or dead URL before save. */
function ImagePreview({ url }: { url: string }) {
  // Track which URL failed to load (rather than a plain broken/ok boolean)
  // so a change to `url` clears the broken state on its own during render —
  // no effect needed to "reset" it.
  const [brokenUrl, setBrokenUrl] = useState<string | null>(null);

  if (!url) return null;

  if (brokenUrl === url) {
    return (
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-md border border-dashed border-border bg-surface-1"
        title="Image failed to load"
      >
        <ImageOff className="size-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      onError={() => setBrokenUrl(url)}
      className="size-10 shrink-0 rounded-md border border-border object-cover"
    />
  );
}

export function CategoryFormDialog({ trigger, category, nextSortOrder = 0 }: CategoryFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const mode = category ? "edit" : "create";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    defaultValues: category ?? {
      name: "",
      slug: "",
      description: "",
      image: "",
      sortOrder: nextSortOrder,
      published: true,
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        category ?? {
          name: "",
          slug: "",
          description: "",
          image: "",
          sortOrder: nextSortOrder,
          published: true,
        },
      );
      setFormError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function onSubmit(values: CategoryFormValues) {
    const parsed = categoryFormSchema.safeParse(values);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createCategoryAction(parsed.data)
          : await updateCategoryAction(category!.id, parsed.data);

      if (result.success) {
        toast.success(mode === "create" ? "Category created" : "Category updated");
        setOpen(false);
        router.refresh();
      } else {
        setFormError(result.error);
        toast.error(result.error);
      }
    });
  }

  const nameValue = watch("name");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogHeader>
            <DialogTitle>{mode === "create" ? "New Category" : "Edit Category"}</DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "Add a category to the shop taxonomy."
                : "Update this category's details."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {formError && <p className="text-sm text-destructive">{formError}</p>}

            <div className="space-y-1.5">
              <Label htmlFor="cat-name">Name</Label>
              <Input
                id="cat-name"
                {...register("name")}
                onChange={(e) => {
                  register("name").onChange(e);
                  if (mode === "create") setValue("slug", slugify(e.target.value));
                }}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="cat-slug">Slug</Label>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="h-auto p-0"
                  onClick={() => setValue("slug", slugify(nameValue))}
                >
                  Generate
                </Button>
              </div>
              <Input id="cat-slug" {...register("slug")} />
              {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-description">Description</Label>
              <Textarea id="cat-description" rows={3} {...register("description")} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-image">Image (path or URL)</Label>
              <div className="flex items-start gap-2">
                <Input id="cat-image" {...register("image")} placeholder="/placeholders/bats.jpg" />
                <ImagePreview url={watch("image") ?? ""} />
              </div>
              {errors.image && <p className="text-sm text-destructive">{errors.image.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-sort">Sort Order</Label>
              <Input id="cat-sort" type="number" step="1" {...register("sortOrder")} />
            </div>

            <label className="flex items-center gap-2 text-sm text-foreground">
              <Checkbox
                checked={watch("published")}
                onCheckedChange={(v) => setValue("published", !!v)}
              />
              Published
            </label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : mode === "create" ? "Create" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
