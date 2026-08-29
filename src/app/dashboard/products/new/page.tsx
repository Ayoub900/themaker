import { PageHeading } from "@/components/dashboard/ui";
import { ProductForm } from "@/app/dashboard/products/product-form";

export default function NewProductPage() {
  return (
    <>
      <PageHeading
        title="New product"
        subtitle="Draft it, look at it on the site, then publish."
      />
      <ProductForm />
    </>
  );
}
