import Link from "next/link";

import {
  DashLink,
  Empty,
  FilterTabs,
  PageHeading,
  Panel,
  StatusPill,
  Table,
  Td,
  Th,
} from "@/components/dashboard/ui";
import { prisma } from "@/lib/prisma";
import { formatDate, plural } from "@/lib/utils";

export default async function PostsListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const posts = await prisma.post.findMany({
    where:
      status && status !== "ALL"
        ? { status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED" }
        : {},
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      author: true,
      readMinutes: true,
      status: true,
      featured: true,
      publishedAt: true,
      updatedAt: true,
    },
  });

  const filters = ["ALL", "PUBLISHED", "DRAFT", "ARCHIVED"];
  const active = status ?? "ALL";

  return (
    <>
      <PageHeading
        title="Journal"
        subtitle={plural(posts.length, "post")}
        action={<DashLink href="/dashboard/posts/new" variant="solid">New post</DashLink>}
      />

      <Panel
        title="Writing"
        action={
          <FilterTabs
            label="Filter posts by status"
            options={filters}
            active={active}
            hrefFor={(filter) =>
              filter === "ALL" ? "/dashboard/posts" : `/dashboard/posts?status=${filter}`
            }
          />
        }
      >
        {posts.length === 0 ? (
          <Empty>
            Nothing written yet.{" "}
            <Link href="/dashboard/posts/new" className="text-gold hover:underline">
              Start one
            </Link>
            .
          </Empty>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Title</Th>
                <Th>Category</Th>
                <Th>Author</Th>
                <Th>Status</Th>
                <Th>Published</Th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <Td primary>
                    <Link
                      href={`/dashboard/posts/${post.id}`}
                      className="text-[15px] hover:text-gold"
                    >
                      {post.title}
                    </Link>
                    <span className="mt-1 block text-[12px] text-faint">
                      {post.readMinutes} min{post.featured ? " · featured" : ""}
                    </span>
                  </Td>
                  <Td label="Category" className="text-muted">
                    {post.category}
                  </Td>
                  <Td label="Author" className="text-muted">
                    {post.author}
                  </Td>
                  <Td label="Status">
                    <StatusPill status={post.status} />
                  </Td>
                  <Td label="Published" className="whitespace-nowrap text-faint">
                    {post.publishedAt ? formatDate(post.publishedAt) : "—"}
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
