import { BlogPostForm } from "@/components/BlogPostForm";

export default function NewBlogPostPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Add New Blog Post</h2>
            </div>
            <BlogPostForm />
        </div>
    );
}
