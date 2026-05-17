import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();
  return (
    <main>
      <h1>CSS Widgets</h1>
      <p>Front-end Technologies | CSS, HTML, Accessibility.</p>
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
    </main>
  );
}
