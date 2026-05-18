import { getAllPosts, getAllTags } from "@/lib/posts";
import { HomePostList } from "@/components/HomePostList/HomePostList";

export default function Home() {
  const posts = getAllPosts();
  const tags = getAllTags();
  const listPosts = posts.map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    date: p.frontmatter.date,
    timeToRead: p.timeToRead,
    tags: p.frontmatter.tags,
    description: p.frontmatter.description,
    coverSrc: p.frontmatter.cover
      ? `/posts/${p.slug}/${p.frontmatter.cover.img}`
      : undefined,
  }));
  return (
    <>
      <h1>Posts</h1>
      <HomePostList posts={listPosts} tags={tags} />
    </>
  );
}
