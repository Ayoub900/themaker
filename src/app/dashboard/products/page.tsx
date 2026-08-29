import Link from "next/link";

import {
  DashLink,
  Empty,
  FilterTabs,
  PageHeading,
  Panel,
  SearchField,
  StatusPill,
  Table,
  Td,
  Th,
} from "@/components/dashboard/ui";
import { formatCents } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { formatDate, plural } from "@/lib/utils";

export default async function ProductsListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;

  const products = await prisma.product.findMany({
    where: {
      ...(status && status !== "ALL"
        ? { status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED" }
        : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { material: { contains: q, mode: "insensitive" as const } },
              { reference: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    orderBy: [{ sortIndex: "asc" }, { name: "asc" }],
    select: {
      id: true,
      slug: true,
      name: true,
      reference: true,
      material: true,
      collection: true,
      priceCents: true,
      currency: true,
      stock: true,
      status: true,
      featured: true,
      updatedAt: true,
    },
  });

  const filters = ["ALL", "PUBLISHED", "DRAFT", "ARCHIVED"];
  const active = status ?? "ALL";

  return (
    <>
      <PageHeading
        title="Products"
        subtitle={plural(products.length, "piece")}
        action={<DashLink href="/dashboard/products/new" variant="solid">New product</DashLink>}
      />

      <Panel
        title="Catalogue"
        action={
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-5">
            <FilterTabs
              label="Filter products by status"
              options={filters}
              active={active}
              hrefFor={(filter) =>
                filter === "ALL"
                  ? "/dashboard/products"
                  : `/dashboard/products?status=${filter}`
              }
            />
            <SearchField
              label="Search products"
              defaultValue={q ?? ""}
              placeholder="Name, material, ref…"
            />
          </div>
        }
      >
        {products.length === 0 ? (
          <Empty>
            Nothing here.{" "}
            <Link href="/dashboard/products/new" className="text-gold hover:underline">
              Add the first piece
            </Link>
            .
          </Empty>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Piece</Th>
                <Th>Collection</Th>
                <Th>Price</Th>
                <Th>Stock</Th>
                <Th>Status</Th>
                <Th>Updated</Th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <Td primary>
                    <Link
                      href={`/dashboard/products/${product.id}`}
                      className="text-[15px] hover:text-gold"
                    >
                      {product.name}
                    </Link>
                    <span className="mt-1 block text-[12px] text-faint">
                      {product.reference} · {product.material}
                      {product.featured ? " · featured" : ""}
                    </span>
                  </Td>
                  <Td label="Collection" className="text-muted">
                    {product.collection}
                  </Td>
                  <Td label="Price" className="lining-nums tabular-nums">
                    {formatCents(product.priceCents, product.currency)}
                  </Td>
                  <Td
                    label="Stock"
                    className={product.stock === 0 ? "text-gold" : "lining-nums tabular-nums"}
                  >
                    {product.stock === 0 ? "Out" : product.stock}
                  </Td>
                  <Td label="Status">
                    <StatusPill status={product.status} />
                  </Td>
                  <Td label="Updated" className="whitespace-nowrap text-faint">
                    {formatDate(product.updatedAt)}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Panel>
    </>
  );
}
