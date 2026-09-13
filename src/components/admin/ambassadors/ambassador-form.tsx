"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ambassadorFormSchema, type AmbassadorFormValues } from "@/lib/validations/ambassador";
import { createAmbassadorAction, updateAmbassadorAction } from "@/lib/actions/admin-ambassadors";
import { slugify } from "@/lib/utils";
import type { Ambassador } from "@/types";

type FormShape = {
  name: string;
  slug: string;
  role: string;
  photo: string;
  bio: string;
  achievements: { value: string }[];
  socialLinks: { platform: string; url: string }[];
  published: boolean;
};

function toFormShape(ambassador?: Ambassador): FormShape {
  if (!ambassador) {
    return {
      name: "",
      slug: "",
      role: "",
      photo: "",
      bio: "",
      achievements: [],
      socialLinks: [],
      published: true,
    };
  }

  return {
    name: ambassador.name,
    slug: ambassador.slug,
    role: ambassador.role,
    photo: ambassador.photo,
    bio: ambassador.bio,
    achievements: ambassador.achievements.map((value) => ({ value })),
    socialLinks: ambassador.socialLinks,
    published: ambassador.published,
  };
}

type AmbassadorFormProps = {
  mode: "create" | "edit";
  ambassador?: Ambassador;
};

export function AmbassadorForm({ mode, ambassador }: AmbassadorFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormShape>({ defaultValues: toFormShape(ambassador) });

  const achievementsArray = useFieldArray({ control, name: "achievements" });
  const socialLinksArray = useFieldArray({ control, name: "socialLinks" });
  const nameValue = watch("name");

  function onSubmit(values: FormShape) {
    setFormError(null);
    const plain: AmbassadorFormValues = {
      ...values,
      achievements: values.achievements.map((a) => a.value),
    };

    const parsed = ambassadorFormSchema.safeParse(plain);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createAmbassadorAction(parsed.data)
          : await updateAmbassadorAction(ambassador!.id, parsed.data);

      if (result.success) {
        toast.success(mode === "create" ? "Ambassador created" : "Ambassador updated");
        router.push("/admin/ambassadors");
        router.refresh();
      } else {
        setFormError(result.error);
        toast.error(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-16" noValidate>
      {formError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {formError}
        </div>
      )}

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Profile</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
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
              <Label htmlFor="slug">Slug</Label>
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
            <Input id="slug" {...register("slug")} />
            {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role">Role</Label>
            <Input id="role" {...register("role")} placeholder="Brand Ambassador" />
            {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="photo">Photo (path or URL)</Label>
            <Input id="photo" {...register("photo")} placeholder="/placeholders/ambassador.jpg" />
            {errors.photo && <p className="text-sm text-destructive">{errors.photo.message}</p>}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bio">Biography</Label>
          <Textarea id="bio" rows={5} {...register("bio")} />
          {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Achievements</h2>
        {achievementsArray.fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Input
              {...register(`achievements.${index}.value` as const)}
              placeholder="e.g. Represented Pakistan U-19"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => achievementsArray.remove(index)}
              aria-label="Remove achievement"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => achievementsArray.append({ value: "" })}
        >
          <Plus className="size-4" /> Add Achievement
        </Button>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Social Links</h2>
        {socialLinksArray.fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Input
              {...register(`socialLinks.${index}.platform` as const)}
              placeholder="Instagram"
              className="w-36"
            />
            <Input
              {...register(`socialLinks.${index}.url` as const)}
              placeholder="https://instagram.com/…"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => socialLinksArray.remove(index)}
              aria-label="Remove social link"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => socialLinksArray.append({ platform: "", url: "" })}
        >
          <Plus className="size-4" /> Add Social Link
        </Button>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Visibility</h2>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <Checkbox checked={watch("published")} onCheckedChange={(v) => setValue("published", !!v)} />
          Published
        </label>
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : mode === "create" ? "Create Ambassador" : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
