"use client";

import { useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  aboutFormSchema,
  ownerProfileFormSchema,
  type AboutFormValues,
} from "@/lib/validations/content";
import { updateAboutAction, updateOwnerProfileAction } from "@/lib/actions/admin-content";
import type { AboutContent, OwnerProfile } from "@/types";

type FormShape = AboutFormValues & {
  ownerName: string;
  ownerRole: string;
  ownerAffiliation: string;
  ownerPhoto: string;
  ownerBio: { value: string }[];
};

export function AboutForm({ about, owner }: { about: AboutContent; owner: OwnerProfile }) {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormShape>({
    defaultValues: {
      intro: about.intro,
      ownerName: owner.name,
      ownerRole: owner.role,
      ownerAffiliation: owner.affiliation,
      ownerPhoto: owner.photo,
      ownerBio: owner.bio.map((value) => ({ value })),
    },
  });

  const bioArray = useFieldArray({ control, name: "ownerBio" });

  function onSubmit(values: FormShape) {
    setFormError(null);

    const aboutParsed = aboutFormSchema.safeParse({ intro: values.intro });
    const ownerParsed = ownerProfileFormSchema.safeParse({
      name: values.ownerName,
      role: values.ownerRole,
      affiliation: values.ownerAffiliation,
      photo: values.ownerPhoto,
      bio: values.ownerBio.map((b) => b.value),
    });

    if (!aboutParsed.success || !ownerParsed.success) {
      if (!aboutParsed.success) {
        for (const issue of aboutParsed.error.issues) {
          if (issue.path[0] === "intro") setError("intro", { message: issue.message });
        }
      }
      if (!ownerParsed.success) {
        const OWNER_FIELD_MAP: Record<string, keyof FormShape> = {
          name: "ownerName",
          role: "ownerRole",
          affiliation: "ownerAffiliation",
          photo: "ownerPhoto",
        };
        for (const issue of ownerParsed.error.issues) {
          const field = OWNER_FIELD_MAP[String(issue.path[0])];
          if (field) setError(field, { message: issue.message });
        }
      }
      setFormError(
        (aboutParsed.success ? null : aboutParsed.error.issues[0]?.message) ??
          (ownerParsed.success ? null : ownerParsed.error.issues[0]?.message) ??
          "Invalid input",
      );
      return;
    }

    startTransition(async () => {
      const [aboutResult, ownerResult] = await Promise.all([
        updateAboutAction(aboutParsed.data),
        updateOwnerProfileAction(ownerParsed.data),
      ]);

      if (aboutResult.success && ownerResult.success) {
        toast.success("About page updated");
      } else {
        const error = !aboutResult.success ? aboutResult.error : !ownerResult.success ? ownerResult.error : "";
        setFormError(error);
        toast.error(error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {formError && <p className="text-sm text-destructive">{formError}</p>}

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Intro</h2>
        <div className="space-y-1.5">
          <Label htmlFor="intro">About Page Intro</Label>
          <Textarea id="intro" rows={4} {...register("intro")} />
          {errors.intro && <p className="text-sm text-destructive">{errors.intro.message}</p>}
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Founder Profile</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="ownerName">Name</Label>
            <Input id="ownerName" {...register("ownerName")} />
            {errors.ownerName && (
              <p className="text-sm text-destructive">{errors.ownerName.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ownerRole">Role</Label>
            <Input id="ownerRole" {...register("ownerRole")} />
            {errors.ownerRole && (
              <p className="text-sm text-destructive">{errors.ownerRole.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ownerAffiliation">Affiliation</Label>
            <Input id="ownerAffiliation" {...register("ownerAffiliation")} />
            {errors.ownerAffiliation && (
              <p className="text-sm text-destructive">{errors.ownerAffiliation.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ownerPhoto">Photo (path or URL)</Label>
            <Input id="ownerPhoto" {...register("ownerPhoto")} />
            {errors.ownerPhoto && (
              <p className="text-sm text-destructive">{errors.ownerPhoto.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Biography Paragraphs</Label>
          {bioArray.fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Textarea rows={2} {...register(`ownerBio.${index}.value` as const)} />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => bioArray.remove(index)}
                aria-label="Remove paragraph"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => bioArray.append({ value: "" })}
          >
            <Plus className="size-4" /> Add Paragraph
          </Button>
        </div>
      </section>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Save About Page"}
      </Button>
    </form>
  );
}
