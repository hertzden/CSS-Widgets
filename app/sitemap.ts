import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { siteMetadata } from "@/lib/site";

export const dynamic = "force-static";

const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "about", changeFrequency: "yearly", priority: 0.6 },
  { path: "guides", changeFrequency: "yearly", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteMetadata.url;
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, changeFrequency, priority }) => ({
      url: path ? `${base}/${path}/` : `${base}/`,
      lastModified: now,
      changeFrequency,
      priority,
    }),
  );

  const posts = getAllPosts();
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/${post.slug}/`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...postEntries];
}
