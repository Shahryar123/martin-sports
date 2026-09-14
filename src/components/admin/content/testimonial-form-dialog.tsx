"use client";

import { useEffect, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { testimonialFormSchema, type TestimonialFormValues } from "@/lib/validations/content";
import { createTestimonialAction, updateTestimonialAction } from "@/lib/actions/admin-content";
import type { Testimonial } from "@/types";

const EMPTY: TestimonialFormValues = {
  authorName: "",
  authorLocation: "",
  rating: 5,
  quote: "",
  productSlug: "",
  published: true,
};

export function TestimonialFormDialog({
  trigger,
  testimonial,
}: {
  trigger: ReactNode;
  testimonial?: Testimonial;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const mode = testimonial ? "edit" : "create";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<TestimonialFormValues>({
    defaultValues: testimonial ?? EMPTY,
  });

  useEffect(() => {
    if (open) {
      reset(testimonial ?? EMPTY);
      setFormError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function onSubmit(values: TestimonialFormValues) {
    const parsed = testimonialFormSchema.safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        if (issue.path[0]) {
          setError(issue.path[0] as keyof TestimonialFormValues, { message: issue.message });
        }
      }
      setFormError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createTestimonialAction(parsed.data)
          : await updateTestimonialAction(testimonial!.id, parsed.data);

      if (result.success) {
        toast.success(mode === "create" ? "Testimonial created" : "Testimonial updated");
        setOpen(false);
        router.refresh();
      } else {
        setFormError(result.error);
        toast.error(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogHeader>
            <DialogTitle>{mode === "create" ? "New Testimonial" : "Edit Testimonial"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {formError && <p className="text-sm text-destructive">{formError}</p>}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="authorName">Author Name</Label>
                <Input id="authorName" {...register("authorName")} />
                {errors.authorName && (
                  <p className="text-sm text-destructive">{errors.authorName.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="authorLocation">Location</Label>
                <Input id="authorLocation" {...register("authorLocation")} />
                {errors.authorLocation && (
                  <p className="text-sm text-destructive">{errors.authorLocation.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="quote">Quote</Label>
              <Textarea id="quote" rows={3} {...register("quote")} />
              {errors.quote && <p className="text-sm text-destructive">{errors.quote.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rating">Rating</Label>
              <Select
                value={String(watch("rating"))}
                onValueChange={(v) => setValue("rating", Number(v))}
              >
                <SelectTrigger id="rating" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} star{n === 1 ? "" : "s"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
