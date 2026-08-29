import { CheckoutForm } from "@/components/shop/checkout-form";
import { Container, Eyebrow } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Checkout",
  description: "Confirm your details and place the order.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return (
    <section className="py-14 md:py-20">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <Eyebrow>Checkout</Eyebrow>
          <h1 className="text-[clamp(2.25rem,5vw,3.25rem)] leading-[1.08]">
            Where should it go?
          </h1>
          <p className="max-w-[52ch] text-[16px] leading-[1.8] text-muted">
            We confirm every order by hand before anything is charged, so nothing is
            taken from you on this page.
          </p>
        </div>

        <CheckoutForm />
      </Container>
    </section>
  );
}
