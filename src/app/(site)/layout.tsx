import { JsonLd } from "@/components/json-ld";
import { CartProvider } from "@/components/shop/cart-provider";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { organizationLd, websiteLd } from "@/lib/seo";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <CartProvider>
      {/* Site-wide graph. Page-level entities reference these by @id. */}
      <JsonLd data={[organizationLd(), websiteLd()]} />
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
