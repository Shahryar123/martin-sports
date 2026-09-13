"use server";

import { productRepository } from "@/lib/repositories/product-repository";
import type { ProductListParams, ProductListResult, ProductSuggestion } from "@/types";

export async function getSearchSuggestions(query: string): Promise<ProductSuggestion[]> {
  return productRepository.suggest(query, 6);
}

/** Fetches the next page for the shop grid's "Load More" button, using the
 * exact same filters the current URL already applied. */
export async function loadMoreProducts(params: ProductListParams): Promise<ProductListResult> {
  return productRepository.list(params);
}
