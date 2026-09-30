/**
 * The journal's topic clusters — the "cocoon" the internal linking is built on.
 *
 * Each cluster is one subject, with one pillar guide that covers it end to end
 * and a set of articles that each answer one narrower question. The pages wire
 * the links from this file, so the structure holds even when a post's body
 * forgets to:
 *
 *   - every article links up to its pillar (breadcrumb and the guide box),
 *   - the pillar links down to every article in its cluster,
 *   - articles link sideways to their siblings,
 *   - articles link to the products they name, and those product pages link
 *     back — and a product with no article of its own links to the pillar of
 *     the cluster that covers its collection.
 *
 * A post joins a cluster by its `cluster` field (set from the dashboard).
 */

export type Cluster = {
  key: string;
  /** The subject, as a reader would search for it. */
  name: string;
  /** One sentence, used on the journal index and in llms.txt. */
  description: string;
  /** Slug of the pillar guide for this cluster. */
  pillar: string;
  /** Product collections this cluster is the guide for. */
  collections: readonly string[];
};

export const clusters = [
  {
    key: "lighting",
    name: "Moroccan brass lighting",
    description:
      "Hand-pierced brass chandeliers, pendants and lanterns: how they are made, how to size them, which bulb to use and how to tell the real thing.",
    pillar: "moroccan-brass-lamps-guide",
    collections: ["Light"],
  },
  {
    key: "care",
    name: "Brass care and patina",
    description:
      "How solid brass, bronze and copper age, how to clean them, and why we leave them unlacquered.",
    pillar: "brass-care-guide",
    collections: ["Hardware", "Table"],
  },
  {
    key: "craft",
    name: "Moroccan metalwork",
    description:
      "Dinanderie, the Moroccan craft of hammered, pierced and chased metal — its techniques, its tools and the workshops that keep it going.",
    pillar: "moroccan-metalwork-guide",
    collections: ["Vessels"],
  },
  {
    key: "buying",
    name: "Buying from Marrakech",
    description:
      "Commissions, prices, shipping abroad and visiting a metal workshop in Marrakech.",
    pillar: "buying-handmade-metalwork-marrakech",
    collections: [],
  },
] as const satisfies readonly Cluster[];

export type ClusterKey = (typeof clusters)[number]["key"];

export function getCluster(key: string | null | undefined): Cluster | null {
  return clusters.find((cluster) => cluster.key === key) ?? null;
}

/** The cluster whose guide covers a product collection, if any. */
export function clusterForCollection(collection: string): Cluster | null {
  return (
    clusters.find((cluster) =>
      (cluster.collections as readonly string[]).includes(collection),
    ) ?? null
  );
}

export function isPillar(slug: string): boolean {
  return clusters.some((cluster) => cluster.pillar === slug);
}
