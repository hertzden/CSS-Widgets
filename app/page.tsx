import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();
  return (
    <>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/${post.slug}`}>{post.frontmatter.title}</Link>{" "}
            <small>
              <time dateTime={String(post.frontmatter.date)}>
                {String(post.frontmatter.date)}
              </time>
            </small>
          </li>
        ))}
      </ul>
    </>
  );
}
