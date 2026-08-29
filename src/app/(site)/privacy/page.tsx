import { JsonLd } from "@/components/json-ld";
import { Container, Eyebrow } from "@/components/ui";
import { address, contactChannels, site } from "@/config/site";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy",
  description:
    "What The Maker collects, why, how long it is kept and how to have it removed. No advertising trackers, no third-party analytics, no data sold to anyone.",
  path: "/privacy",
});

const sections = [
  {
    title: "The short version",
    body: [
      "We collect what an order or a message needs and nothing else. There are no advertising trackers on this site, no third-party analytics, no cookie banner — because there is nothing to consent to beyond the one cookie described below.",
      "We have never sold data and will not.",
    ],
  },
  {
    title: "What we hold, and why",
    body: [
      "Orders: your name, email, telephone if you gave one, delivery address and what you ordered. We need this to make the thing and post it to you, and Moroccan commercial law requires us to keep invoicing records for ten years.",
      "Messages: your name, email and what you wrote, so we can reply and so we can find the conversation again when a repair comes back in five years.",
    ],
  },
  {
    title: "Cookies",
    body: [
      "One, and only if you sign in to the workshop dashboard: a session cookie that keeps you logged in for eight hours. It is httpOnly, it holds no personal data beyond your account id, and it is not used for tracking.",
      "Your cart is stored in your own browser's local storage, which never leaves your device until you place an order.",
    ],
  },
  {
    title: "Who else sees it",
    body: [
      "The carrier, for the address on the parcel. Our hosting and database providers, as processors under contract. Our accountant, for invoices. Nobody else.",
      "Nothing is shared for advertising, profiling or resale, wherever it is hosted.",
    ],
  },
  {
    title: "Your rights",
    body: [
      `Under Moroccan law 09-08 on the protection of personal data you may ask for a copy of what we hold, ask us to correct it, ask us to delete it, or object to how we use it. Reach us on ${contactChannels}, or send the request through the contact page, and we will answer within a month, usually within two days.`,
      "If we cannot resolve it, you may complain to the CNDP, the Moroccan data protection authority.",
    ],
  },
  {
    title: "Who is responsible",
    body: [
      `${site.legalName}, ${address.oneLine}, ${address.country}. Contact: ${contactChannels}.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Privacy", path: "/privacy" },
        ])}
      />

      <section className="border-b border-ink/10 py-14 md:py-20">
        <Container className="flex flex-col gap-6">
          <Eyebrow>Legal</Eyebrow>
          <h1 className="max-w-[16ch] text-[clamp(2.5rem,6vw,4rem)] leading-[1.05]">
            Privacy
          </h1>
          <p className="max-w-[560px] text-[16px] leading-[1.8] text-muted">
            A workshop of two people does not need your data, and mostly does not want it.
          </p>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container className="max-w-[780px] flex flex-col gap-12">
          {sections.map((section) => (
            <section key={section.title} className="flex flex-col gap-3.5">
              <h2 className="text-[1.5rem] leading-tight">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="text-[16px] leading-[1.85] text-ink-soft"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </Container>
      </section>
    </>
  );
}
