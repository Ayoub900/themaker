import { PageHeading } from "@/components/dashboard/ui";
import { ProductForm } from "@/app/dashboard/products/product-form";

export default function NewProductPage() {
  return (
    <>
      <PageHeading
        title="Add a product"
        subtitle="Fill in the form and press save. The product stays hidden until you choose “Shown on the website”."
      />
      <ProductForm />
    </>
  );
}
