import { clusters } from "@/config/clusters";
import { absoluteUrl, address, contact, policies, shipping, site } from "@/config/site";
import { formatCents } from "@/lib/money";
import { getPosts, getProducts } from "@/lib/queries";

export const revalidate = 3600;

/**
 * `/llms.txt` — a plain-markdown map of the site for language models and the
 * answer engines built on them (https://llmstxt.org). It states who the
 * workshop is and where, then lists the guides with their articles and the
 * catalogue, so a model citing the site lands on the right page.
 */
export async function GET() {
  const [posts, products] = await Promise.all([getPosts(), getProducts()]);

  const link = (title: string, path: string, note?: string) =>
    `- [${title}](${absoluteUrl(path)})${note ? `: ${note}` : ""}`;

  const guides = clusters.flatMap((cluster) => {
    const pillar = posts.find((post) => post.slug === cluster.pillar);
    const articles = posts.filter(
      (post) => post.cluster === cluster.key && post.slug !== cluster.pillar,
    );
    if (!pillar && articles.length === 0) return [];
    return [
      `### ${cluster.name}`,
      "",
      cluster.description,
      "",
      ...(pillar ? [link(`${pillar.title} (the guide)`, `/journal/${pillar.slug}`, pillar.excerpt)] : []),
      ...articles.map((post) => link(post.title, `/journal/${post.slug}`, post.excerpt)),
      "",
    ];
  });

  const loose = posts.filter((post) => !post.cluster);

  const body = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `${site.name} (${site.legalName}) is a metal workshop in ${address.district}, ${site.city}, ${site.country}, founded in ${site.founded}. It makes solid brass, bronze and copper pieces by hand — including hand-pierced Moroccan brass chandeliers and lamps — and takes commissions.`,
    "",
    `- Location: ${address.oneLine}, ${site.country}`,
    `- Contact: ${[contact.phone, contact.email].filter(Boolean).join(", ")}`,
    `- Prices in Moroccan dirham (MAD). Delivery within Morocco: ${formatCents(shipping.flatRateCents)} flat, free over ${formatCents(shipping.freeThresholdCents)}. ${shipping.internationalNote}`,
    `- Lead times: ${policies.leadTimeStock} for stock pieces, ${policies.leadTimeCommission} for commissions. ${policies.warranty}.`,
    "",
    "## Guides",
    "",
    ...guides,
    ...(loose.length > 0
      ? ["## More from the journal", "", ...loose.map((post) => link(post.title, `/journal/${post.slug}`, post.excerpt)), ""]
      : []),
    "## Catalogue",
    "",
    ...products.map((product) =>
      link(product.name, `/products/${product.slug}`, `${product.material}, ${formatCents(product.priceCents)}. ${product.summary}`),
    ),
    "",
    "## Pages",
    "",
    link("About the workshop", "/about"),
    link("Care and repair", "/care"),
    link("Shipping and returns", "/shipping"),
    link("Questions", "/faq"),
    link("Contact and visits", "/contact"),
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
