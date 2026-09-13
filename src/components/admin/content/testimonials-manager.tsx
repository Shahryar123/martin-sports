"use client";

import { useRouter } from "next/navigation";
import { Star, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublishToggle } from "@/components/admin/publish-toggle";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { TestimonialFormDialog } from "@/components/admin/content/testimonial-form-dialog";
import {
  deleteTestimonialAction,
  updateTestimonialAction,
} from "@/lib/actions/admin-content";
import { testimonialFormSchema } from "@/lib/validations/content";
import type { Testimonial } from "@/types";

export function TestimonialsManager({ testimonials }: { testimonials: Testimonial[] }) {
  const router = useRouter();

  async function setPublished(testimonial: Testimonial, published: boolean) {
    const parsed = testimonialFormSchema.safeParse({ ...testimonial, published });
    if (!parsed.success) {
      return { success: false as const, error: "Invalid testimonial data" };
    }
    return updateTestimonialAction(testimonial.id, parsed.data);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <TestimonialFormDialog
          trigger={
            <Button>
              <Plus className="size-4" /> New Testimonial
            </Button>
          }
        />
      </div>

      {testimonials.length === 0 ? (
        <EmptyState icon={Star} title="No testimonials yet" description="Add your first customer testimonial." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardContent className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{testimonial.authorName}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.authorLocation}</p>
                  </div>
                  <PublishToggle
                    published={testimonial.published}
                    onToggle={(next) => setPublished(testimonial, next)}
                  />
                </div>
                <div className="flex gap-0.5" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < testimonial.rating
                          ? "size-3.5 fill-brand text-brand"
                          : "size-3.5 text-muted-foreground/30"
                      }
                    />
                  ))}
                </div>
                <p className="text-sm text-foreground-secondary">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex justify-end gap-1">
                  <TestimonialFormDialog
                    testimonial={testimonial}
                    trigger={
                      <Button variant="ghost" size="icon-sm" aria-label="Edit testimonial">
                        <Pencil className="size-4" />
                      </Button>
                    }
                  />
                  <ConfirmDialog
                    trigger={
                      <Button variant="ghost" size="icon-sm" aria-label="Delete testimonial">
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    }
                    title="Delete this testimonial?"
                    description="This will be permanently removed."
                    confirmLabel="Delete"
                    onConfirm={() => deleteTestimonialAction(testimonial.id)}
                    onSuccess={() => router.refresh()}
                    successMessage="Testimonial deleted"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
