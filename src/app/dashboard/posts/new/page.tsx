import { PageHeading } from "@/components/dashboard/ui";
import { PostForm } from "@/app/dashboard/posts/post-form";

export default function NewPostPage() {
  return (
    <>
      <PageHeading
        title="New journal post"
        subtitle="Markdown in, a real page out. Drafts are invisible to the site."
      />
      <PostForm />
    </>
  );
}
