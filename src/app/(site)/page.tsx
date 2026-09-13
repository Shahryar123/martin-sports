import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/products/product-image";
import { productRepository } from "@/lib/repositories/product-repository";
import { getCategoryName } from "@/lib/constants/categories";
import { SITE_CONFIG } from "@/lib/constants/site";

export default async function HomePage() {
  const featured = await productRepository.getFeatured(4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-1/60 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <Badge variant="secondary" className="mb-6">
            Nationwide Delivery · Cash on Delivery
          </Badge>
          <h1 className="max-w-2xl font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Cricket gear built for the game.
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            {SITE_CONFIG.description}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/products">
                Shop the Collection
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">About Martin Sports</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-border bg-surface-0">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            { icon: Truck, label: "Nationwide Delivery", desc: "Across Pakistan" },
            { icon: Banknote, label: "Cash on Delivery", desc: "Pay when it arrives" },
            { icon: ShieldCheck, label: "Trusted by Trainers", desc: "PIA Sports Complex, Karachi" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-md border border-border bg-surface-1">
                <Icon className="size-5 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              Featured Products
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Placeholder catalog — real product photography and details
              coming soon.
            </p>
          </div>
          <Link
            href="/products"
            className="hidden text-sm font-medium text-primary hover:underline sm:inline-flex items-center gap-1"
          >
            View all <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featured.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group block overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/40"
            >
              <ProductImage
                images={product.images}
                name={product.name}
                category={product.category}
                className="aspect-square w-full"
              />
              <div className="p-4">
                <p className="text-xs text-muted-foreground">
                  {getCategoryName(product.category)}
                </p>
                <p className="mt-1 line-clamp-2 text-sm font-medium text-foreground">
                  {product.name}
                </p>
                <p className="mt-2 text-sm font-semibold text-primary">
                  Rs. {product.price.toLocaleString("en-PK")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
