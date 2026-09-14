"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { homepageFormSchema, type HomepageFormValues } from "@/lib/validations/content";
import { updateHomepageAction } from "@/lib/actions/admin-content";
import type { HomepageContent } from "@/types";

export function HomepageForm({ homepage }: { homepage: HomepageContent }) {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<HomepageFormValues>({
    defaultValues: {
      heroHeading: homepage.heroHeading,
      heroSubheading: homepage.heroSubheading,
      heroCtaLabel: homepage.heroCtaLabel,
      heroCtaHref: homepage.heroCtaHref,
    },
  });

  function onSubmit(values: HomepageFormValues) {
    setFormError(null);
    const parsed = homepageFormSchema.safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        if (issue.path[0]) {
          setError(issue.path[0] as keyof HomepageFormValues, { message: issue.message });
        }
      }
      setFormError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    startTransition(async () => {
      const result = await updateHomepageAction(parsed.data);
      if (result.success) {
        toast.success("Homepage content updated");
      } else {
        setFormError(result.error);
        toast.error(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {formError && <p className="text-sm text-destructive">{formError}</p>}

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Hero Section</h2>
        <p className="text-sm text-muted-foreground">
          Saved here for future wiring — the homepage hero currently renders fixed copy. See
          ARCHITECTURE.md.
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="heroHeading">Heading</Label>
          <Input id="heroHeading" {...register("heroHeading")} />
          {errors.heroHeading && (
            <p className="text-sm text-destructive">{errors.heroHeading.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="heroSubheading">Subheading</Label>
          <Textarea id="heroSubheading" rows={3} {...register("heroSubheading")} />
          {errors.heroSubheading && (
            <p className="text-sm text-destructive">{errors.heroSubheading.message}</p>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="heroCtaLabel">CTA Label</Label>
            <Input id="heroCtaLabel" {...register("heroCtaLabel")} />
            {errors.heroCtaLabel && (
              <p className="text-sm text-destructive">{errors.heroCtaLabel.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="heroCtaHref">CTA Link</Label>
            <Input id="heroCtaHref" {...register("heroCtaHref")} />
            {errors.heroCtaHref && (
              <p className="text-sm text-destructive">{errors.heroCtaHref.message}</p>
            )}
          </div>
        </div>
      </section>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Save Homepage Content"}
      </Button>
    </form>
  );
}
