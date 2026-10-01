import Link from "next/link";

import {
  DashLink,
  Empty,
  FilterTabs,
  PAGE_SIZE,
  PageHeading,
  Pagination,
  Panel,
  RowDelete,
  RowActions,
  RowLink,
  StatusPill,
  parsePage,
  Table,
  Td,
  Th,
} from "@/components/dashboard/ui";
import { deletePost } from "@/app/dashboard/actions";
import { prisma } from "@/lib/prisma";
import { formatDate, plural } from "@/lib/utils";

export default async function PostsListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status, page: pageParam } = await searchParams;

  const where =
    status && status !== "ALL"
      ? { status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED" }
      : {};

  const total = await prisma.post.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(parsePage(pageParam), pageCount);

  const posts = await prisma.post.findMany({
    where,
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
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
        title="Blog articles"
        subtitle={`${plural(total, "article")} — the stories and advice shown on your website.`}
        action={<DashLink href="/dashboard/posts/new" variant="solid">+ Write an article</DashLink>}
      />

      <Panel
        title="All articles"
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
            No articles yet.{" "}
            <Link href="/dashboard/posts/new" className="text-gold hover:underline">
              Start one
            </Link>
            .
          </Empty>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Article</Th>
                <Th>Category</Th>
                <Th>Author</Th>
                <Th>On the website?</Th>
                <Th>Date</Th>
                  <Th>Options</Th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <Td primary>
                    <Link
                      href={`/dashboard/posts/${post.id}`}
                      className="text-[17px] font-medium hover:text-gold"
                    >
                      {post.title}
                    </Link>
                    <span className="mt-1 block text-[14px] text-muted">
                      {post.readMinutes} min read{post.featured ? " · pinned at the top" : ""}
                    </span>
                  </Td>
                  <Td label="Category" className="text-muted">
                    {post.category}
                  </Td>
                  <Td label="Author" className="text-muted">
                    {post.author}
                  </Td>
                  <Td label="On the website?">
                    <StatusPill status={post.status} />
                  </Td>
                  <Td label="Date" className="whitespace-nowrap text-muted">
                    {post.publishedAt ? formatDate(post.publishedAt) : "—"}
                  </Td>
                  <Td label="Options">
                    <RowActions>
                      <RowLink tone="solid" href={`/dashboard/posts/${post.id}`}>
                        Edit
                      </RowLink>
                      <RowLink
                        href={`/journal/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        See it ↗
                      </RowLink>
                      <RowDelete
                        id={post.id}
                        action={deletePost}
                        confirm="Delete this article for good? It will disappear from the website. This cannot be undone."
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
            if (p > 1) params.set("page", String(p));
            const query = params.toString();
            return query ? `/dashboard/posts?${query}` : "/dashboard/posts";
          }}
        />
      </Panel>
    </>
  );
}
