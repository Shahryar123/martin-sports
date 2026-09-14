/**
 * Safely serializes a JSON-LD object for a `<script type="application/ld+json"
 * dangerouslySetInnerHTML>` tag. Plain `JSON.stringify` output can contain a
 * literal `</script>` (or `<!--`) sequence — e.g. inside an admin-entered
 * product name/description — which would close the script element early and
 * let the rest of the string be parsed as HTML. Escaping `<` blocks that
 * without changing the JSON-LD's meaning (JSON-LD consumers un-escape it like
 * any other JS string).
 */
export function toJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
