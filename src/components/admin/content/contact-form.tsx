"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations/content";
import { updateContactAction } from "@/lib/actions/admin-content";
import type { ContactConfig } from "@/types";

export function ContactForm({ contact }: { contact: ContactConfig }) {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const { register, handleSubmit } = useForm<ContactFormValues>({
    defaultValues: contact,
  });

  function onSubmit(values: ContactFormValues) {
    setFormError(null);
    const parsed = contactFormSchema.safeParse(values);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    startTransition(async () => {
      const result = await updateContactAction(parsed.data);
      if (result.success) {
        toast.success("Contact configuration updated");
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
        <h2 className="font-heading text-lg font-semibold text-foreground">Contact Details</h2>
        <p className="text-sm text-muted-foreground">
          Saved here for future wiring — the public site currently reads these from{" "}
          <code>lib/constants/site.ts</code>. See ARCHITECTURE.md.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register("phone")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="whatsappNumber">WhatsApp Number (E.164, no +)</Label>
            <Input id="whatsappNumber" {...register("whatsappNumber")} placeholder="923001234567" />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Social Links</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="instagram">Instagram</Label>
            <Input id="instagram" {...register("social.instagram")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="facebook">Facebook</Label>
            <Input id="facebook" {...register("social.facebook")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tiktok">TikTok</Label>
            <Input id="tiktok" {...register("social.tiktok")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="youtube">YouTube</Label>
            <Input id="youtube" {...register("social.youtube")} />
          </div>
        </div>
      </section>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Save Contact Configuration"}
      </Button>
    </form>
  );
}
