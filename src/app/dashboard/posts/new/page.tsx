import { PageHeading } from "@/components/dashboard/ui";
import { PostForm } from "@/app/dashboard/posts/post-form";

export default function NewPostPage() {
  return (
    <>
      <PageHeading
        title="Write a blog article"
        subtitle="Fill in the form and press save. It stays hidden until you choose “Shown on the website”."
      />
      <PostForm />
    </>
  );
}
