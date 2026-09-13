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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productFormSchema } from "@/lib/validations/product";
import { createProductAction, updateProductAction } from "@/lib/actions/admin-products";
import { slugify } from "@/lib/utils";
import type { Category, Product } from "@/types";

type FormShape = {
  name: string;
  sku: string;
  brand: string;
  category: string;
  price: string;
  salePrice: string;
  quantity: string;
  stockStatus: Product["stockStatus"];
  shortDescription: string;
  description: string;
  features: { value: string }[];
  specifications: { label: string; value: string }[];
  sizes: { id?: string; label: string; priceDelta: string; inStock: boolean; sku: string }[];
  images: { value: string }[];
  published: boolean;
  featured: boolean;
  isNew: boolean;
  bestSeller: boolean;
  slug: string;
  seoTitle: string;
  seoDescription: string;
};

function toFormShape(product?: Product): FormShape {
  if (!product) {
    return {
      name: "",
      sku: "",
      brand: "Martin Sports",
      category: "",
      price: "",
      salePrice: "",
      quantity: "",
      stockStatus: "in-stock",
      shortDescription: "",
      description: "",
      features: [],
      specifications: [],
      sizes: [],
      images: [{ value: "" }],
      published: false,
      featured: false,
      isNew: false,
      bestSeller: false,
      slug: "",
      seoTitle: "",
      seoDescription: "",
    };
  }

  return {
    name: product.name,
    sku: product.sku,
    brand: product.brand,
    category: product.category,
    price: String(product.price),
    salePrice: product.salePrice ? String(product.salePrice) : "",
    quantity: product.quantity !== undefined ? String(product.quantity) : "",
    stockStatus: product.stockStatus,
    shortDescription: product.shortDescription,
    description: product.description,
    features: product.features.map((value) => ({ value })),
    specifications: product.specifications,
    sizes: (product.sizes ?? []).map((s) => ({
      id: s.id,
      label: s.label,
      priceDelta: s.priceDelta !== undefined ? String(s.priceDelta) : "",
      inStock: s.inStock,
      sku: s.sku ?? "",
    })),
    images: product.images.length ? product.images.map((value) => ({ value })) : [{ value: "" }],
    published: product.published,
    featured: product.featured,
    isNew: product.isNew,
    bestSeller: product.bestSeller,
    slug: product.slug,
    seoTitle: product.seo?.title ?? "",
    seoDescription: product.seo?.description ?? "",
  };
}

function toPlainValues(values: FormShape) {
  return {
    name: values.name,
    sku: values.sku,
    brand: values.brand,
    category: values.category,
    price: values.price,
    salePrice: values.salePrice || undefined,
    currency: "PKR" as const,
    quantity: values.quantity || undefined,
    stockStatus: values.stockStatus,
    shortDescription: values.shortDescription,
    description: values.description,
    features: values.features.map((f) => f.value),
    specifications: values.specifications,
    sizes: values.sizes.map((s) => ({
      id: s.id,
      label: s.label,
      priceDelta: s.priceDelta || undefined,
      inStock: s.inStock,
      sku: s.sku || undefined,
    })),
    images: values.images.map((i) => i.value),
    published: values.published,
    featured: values.featured,
    isNew: values.isNew,
    bestSeller: values.bestSeller,
    slug: values.slug,
    seoTitle: values.seoTitle || undefined,
    seoDescription: values.seoDescription || undefined,
  };
}

const SECTION_FIELD_LABEL: Record<string, string> = {
  name: "Name",
  sku: "SKU",
  brand: "Brand",
  category: "Category",
  price: "Price",
  salePrice: "Sale price",
  quantity: "Quantity",
  stockStatus: "Stock status",
  shortDescription: "Short description",
  description: "Description",
  images: "Images",
  slug: "Slug",
};

type ProductFormProps = {
  mode: "create" | "edit";
  product?: Product;
  categories: Category[];
};

export function ProductForm({ mode, product, categories }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormShape>({ defaultValues: toFormShape(product) });

  const featuresArray = useFieldArray({ control, name: "features" });
  const specsArray = useFieldArray({ control, name: "specifications" });
  const sizesArray = useFieldArray({ control, name: "sizes" });
  const imagesArray = useFieldArray({ control, name: "images" });

  const nameValue = watch("name");

  function onSubmit(values: FormShape) {
    setFormErrors([]);
    const plain = toPlainValues(values);
    const parsed = productFormSchema.safeParse(plain);

    if (!parsed.success) {
      const messages = parsed.error.issues.map((issue) => {
        const field = issue.path[0] ? SECTION_FIELD_LABEL[String(issue.path[0])] : undefined;
        if (field && issue.path.length === 1) {
          setError(issue.path[0] as keyof FormShape, { message: issue.message });
        }
        return field ? `${field}: ${issue.message}` : issue.message;
      });
      setFormErrors(messages);
      return;
    }

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createProductAction(parsed.data)
          : await updateProductAction(product!.id, parsed.data);

      if (result.success) {
        toast.success(mode === "create" ? "Product created" : "Product updated");
        router.push("/admin/products");
        router.refresh();
      } else {
        setFormErrors([result.error]);
        toast.error(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-16" noValidate>
      {formErrors.length > 0 && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <p className="font-medium">Please fix the following:</p>
          <ul className="mt-1.5 list-inside list-disc space-y-0.5">
            {formErrors.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Basic */}
      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Basic</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name")}
              onChange={(e) => {
                register("name").onChange(e);
                if (!product) setValue("slug", slugify(e.target.value));
              }}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" {...register("sku")} />
            {errors.sku && <p className="text-sm text-destructive">{errors.sku.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="brand">Brand</Label>
            <Input id="brand" {...register("brand")} />
            {errors.brand && <p className="text-sm text-destructive">{errors.brand.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="category">Category</Label>
            <Select
              value={watch("category")}
              onValueChange={(v) => setValue("category", v, { shouldDirty: true })}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Pricing</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="price">Price (PKR)</Label>
            <Input id="price" type="number" step="1" min="0" {...register("price")} />
            {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="salePrice">Sale Price (optional)</Label>
            <Input id="salePrice" type="number" step="1" min="0" {...register("salePrice")} />
            {errors.salePrice && (
              <p className="text-sm text-destructive">{errors.salePrice.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="currency">Currency</Label>
            <Input id="currency" value="PKR" disabled />
          </div>
        </div>
      </section>

      {/* Inventory */}
      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Inventory</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="quantity">Quantity (optional)</Label>
            <Input id="quantity" type="number" step="1" min="0" {...register("quantity")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="stockStatus">Stock Status</Label>
            <Select
              value={watch("stockStatus")}
              onValueChange={(v) => setValue("stockStatus", v as Product["stockStatus"])}
            >
              <SelectTrigger id="stockStatus" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Content</h2>
        <div className="space-y-1.5">
          <Label htmlFor="shortDescription">Short Description</Label>
          <Textarea id="shortDescription" rows={2} {...register("shortDescription")} />
          {errors.shortDescription && (
            <p className="text-sm text-destructive">{errors.shortDescription.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="description">Full Description</Label>
          <Textarea id="description" rows={5} {...register("description")} />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Features</Label>
          {featuresArray.fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input {...register(`features.${index}.value` as const)} placeholder="e.g. Lightweight willow blade" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => featuresArray.remove(index)}
                aria-label="Remove feature"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => featuresArray.append({ value: "" })}
          >
            <Plus className="size-4" /> Add Feature
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Specifications</Label>
          {specsArray.fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(`specifications.${index}.label` as const)}
                placeholder="Label (e.g. Weight)"
                className="w-1/3"
              />
              <Input
                {...register(`specifications.${index}.value` as const)}
                placeholder="Value (e.g. 1180g)"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => specsArray.remove(index)}
                aria-label="Remove specification"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => specsArray.append({ label: "", value: "" })}
          >
            <Plus className="size-4" /> Add Specification
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Sizes</Label>
          {sizesArray.fields.map((field, index) => (
            <div key={field.id} className="flex flex-wrap items-center gap-2">
              <Input
                {...register(`sizes.${index}.label` as const)}
                placeholder="Label (e.g. Size 6)"
                className="w-32"
              />
              <Input
                {...register(`sizes.${index}.priceDelta` as const)}
                type="number"
                placeholder="Price delta"
                className="w-32"
              />
              <Input
                {...register(`sizes.${index}.sku` as const)}
                placeholder="SKU (optional)"
                className="w-32"
              />
              <label className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Checkbox
                  checked={watch(`sizes.${index}.inStock`)}
                  onCheckedChange={(v) => setValue(`sizes.${index}.inStock`, !!v)}
                />
                In stock
              </label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => sizesArray.remove(index)}
                aria-label="Remove size"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => sizesArray.append({ label: "", priceDelta: "", inStock: true, sku: "" })}
          >
            <Plus className="size-4" /> Add Size
          </Button>
        </div>
      </section>

      {/* Images */}
      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Images</h2>
        <div className="space-y-1.5">
          <Label htmlFor="mainImage">Main Image (path or URL)</Label>
          <Input id="mainImage" {...register("images.0.value" as const)} placeholder="/placeholders/bat.jpg" />
          {errors.images?.[0]?.value && (
            <p className="text-sm text-destructive">{errors.images[0]?.value?.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Additional Images</Label>
          {imagesArray.fields.slice(1).map((field, i) => {
            const index = i + 1;
            return (
              <div key={field.id} className="flex gap-2">
                <Input {...register(`images.${index}.value` as const)} placeholder="https://…" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => imagesArray.remove(index)}
                  aria-label="Remove image"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            );
          })}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => imagesArray.append({ value: "" })}
          >
            <Plus className="size-4" /> Add Image
          </Button>
        </div>
      </section>

      {/* Visibility */}
      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Visibility</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              ["published", "Published"],
              ["featured", "Featured"],
              ["isNew", "New"],
              ["bestSeller", "Best Seller"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm text-foreground">
              <Checkbox
                checked={watch(key)}
                onCheckedChange={(v) => setValue(key, !!v, { shouldDirty: true })}
              />
              {label}
            </label>
          ))}
        </div>
      </section>

      {/* SEO */}
      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">SEO</h2>
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
              Generate from name
            </Button>
          </div>
          <Input id="slug" {...register("slug")} />
          {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="seoTitle">SEO Title (optional)</Label>
          <Input id="seoTitle" {...register("seoTitle")} />
          <p className="text-xs text-muted-foreground">
            Don&apos;t include &quot;Martin Sports&quot; — it&apos;s added automatically.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="seoDescription">SEO Description (optional)</Label>
          <Textarea id="seoDescription" rows={2} {...register("seoDescription")} />
        </div>
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : mode === "create" ? "Create Product" : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
