import Link from "next/link";

import {
  DashLink,
  Empty,
  FilterTabs,
  PageHeading,
  PAGE_SIZE,
  Pagination,
  Panel,
  RowDelete,
  RowActions,
  RowLink,
  SearchField,
  parsePage,
  StatusPill,
  Table,
  Td,
  Th,
} from "@/components/dashboard/ui";
import { deleteProduct } from "@/app/dashboard/actions";
import { formatCents } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { formatDate, plural } from "@/lib/utils";

export default async function ProductsListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const { status, q, page: pageParam } = await searchParams;

  const where = {
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
  };

  const total = await prisma.product.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(parsePage(pageParam), pageCount);

  const products = await prisma.product.findMany({
    where,
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
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
        subtitle={`${plural(total, "product")} — click one to change its photos, price or text.`}
        action={<DashLink href="/dashboard/products/new" variant="solid">+ Add a product</DashLink>}
      />

      <Panel
        title="All products"
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
              placeholder="Search by name…"
            />
          </div>
        }
      >
        {products.length === 0 ? (
          <Empty>
            No products found.{" "}
            <Link href="/dashboard/products/new" className="text-gold hover:underline">
              Add your first product
            </Link>
            .
          </Empty>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Product</Th>
                <Th>Collection</Th>
                <Th>Price</Th>
                <Th>In stock</Th>
                <Th>On the website?</Th>
                <Th>Last changed</Th>
                <Th>Options</Th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <Td primary>
                    <Link
                      href={`/dashboard/products/${product.id}`}
                      className="text-[17px] font-medium hover:text-gold"
                    >
                      {product.name}
                    </Link>
                    <span className="mt-1 block text-[14px] text-muted">
                      {product.material}
                      {product.featured ? " · shown on home page" : ""}
                    </span>
                  </Td>
                  <Td label="Collection" className="text-muted">
                    {product.collection}
                  </Td>
                  <Td label="Price" className="lining-nums tabular-nums">
                    {formatCents(product.priceCents, product.currency)}
                  </Td>
                  <Td
                    label="In stock"
                    className={
                      product.stock === null
                        ? "text-muted"
                        : product.stock === 0
                          ? "text-gold"
                          : "lining-nums tabular-nums"
                    }
                  >
                    {product.stock === null
                      ? "Made when ordered"
                      : product.stock === 0
                        ? "Sold out"
                        : product.stock}
                  </Td>
                  <Td label="On the website?">
                    <StatusPill status={product.status} />
                  </Td>
                  <Td label="Last changed" className="whitespace-nowrap text-muted">
                    {formatDate(product.updatedAt)}
                  </Td>
                  <Td label="Options">
                    <RowActions>
                      <RowLink tone="solid" href={`/dashboard/products/${product.id}`}>
                        Edit
                      </RowLink>
                      <RowLink
                        href={`/products/${product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        See it ↗
                      </RowLink>
                      <RowDelete
                        id={product.id}
                        action={deleteProduct}
                        confirm="Delete this product for good? It will disappear from the website. This cannot be undone."
                      />
                    </RowActions>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <Pagination
          page={page}
          total={total}
          hrefFor={(p) => {
            const params = new URLSearchParams();
            if (status && status !== "ALL") params.set("status", status);
            if (q) params.set("q", q);
            if (p > 1) params.set("page", String(p));
            const query = params.toString();
            return query ? `/dashboard/products?${query}` : "/dashboard/products";
          }}
        />
      </Panel>
    </>
  );
}
