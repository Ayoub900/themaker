import { notFound } from "next/navigation";

import { PostForm } from "@/app/dashboard/posts/post-form";
import { PageHeading, StatusPill } from "@/components/dashboard/ui";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) notFound();

  return (
    <>
      <PageHeading
        title={post.title}
        subtitle={`Last saved ${formatDateTime(post.updatedAt)}`}
        action={<StatusPill status={post.status} />}
      />
      <PostForm post={post} />
    </>
  );
}
