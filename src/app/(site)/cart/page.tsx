import { CartView } from "@/components/shop/cart-view";
import { Container, Eyebrow } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Your cart",
  description: "Review your pieces before checkout.",
  path: "/cart",
  noIndex: true,
});

export default function CartPage() {
  return (
    <section className="py-14 md:py-20">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <Eyebrow>Cart</Eyebrow>
          <h1 className="text-[clamp(2.25rem,5vw,3.25rem)] leading-[1.08]">
            Before it leaves the bench.
          </h1>
        </div>

        <CartView />
      </Container>
    </section>
  );
}
