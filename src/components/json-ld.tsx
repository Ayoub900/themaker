/**
 * Renders a schema.org graph into the page.
 *
 * The payload is produced by our own code in `src/lib/seo.ts`, never by user
 * input, and `<` is escaped so a stray sequence cannot close the script tag.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
