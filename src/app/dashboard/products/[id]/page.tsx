import { notFound } from "next/navigation";

import { ProductForm } from "@/app/dashboard/products/product-form";
import { PageHeading, StatusPill } from "@/components/dashboard/ui";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) notFound();

  return (
    <>
      <PageHeading
        title={product.name}
        subtitle={`${product.reference} · last saved ${formatDateTime(product.updatedAt)}`}
        action={<StatusPill status={product.status} />}
      />
      <ProductForm product={product} />
    </>
  );
}
