/**
 * Martin Sports currently sells only its own house brand, but the field
 * and filter are real (not stubbed) so the catalog can carry additional
 * brands later without a data-model change.
 */
export const BRANDS = ["Martin Sports"] as const;

export type Brand = (typeof BRANDS)[number];
