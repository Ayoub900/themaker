import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

/**
 * Markdown bodies for products and journal posts.
 *
 * react-markdown does not render raw HTML unless `rehype-raw` is added, and it
 * is deliberately not — dashboard content therefore cannot inject script tags
 * even if an editor account were compromised.
 */
export function Markdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className={cn("prose-workshop", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }) => {
            const external = Boolean(href && /^https?:\/\//.test(href));
            return (
              <a
                href={href}
                {...(external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
