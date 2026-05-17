import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostFrontmatter = {
  title: string;
  slug: string;
  date: string;
  cover?: { img: string; source?: string; url?: string };
  tags?: string[];
  showToc?: boolean;
  description?: string;
};

export type Post = {
  slug: string;
  rawSlug: string;
  frontmatter: PostFrontmatter;
  content: string;
  filePath: string;
};

function normalizeSlug(rawSlug: string): string {
  return rawSlug.replace(/^\/+|\/+$/g, "");
}

function normalizeCodeFences(content: string): string {
  return content.replace(
    /^```\s*([A-Za-z0-9]+):title=([^\s`]+)\s*$/gm,
    (_match, lang: string, title: string) =>
      `\`\`\`${lang.toLowerCase()} title="${title}"`,
  );
}

function rewriteRelativeImages(content: string, slug: string): string {
  return content.replace(
    /(!\[[^\]]*\]\()([^)]+)(\))/g,
    (match, prefix: string, url: string, suffix: string) => {
      if (
        url.startsWith("/") ||
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("data:") ||
        url.startsWith("#")
      ) {
        return match;
      }
      return `${prefix}/posts/${slug}/${url}${suffix}`;
    },
  );
}

export function getAllPosts(): Post[] {
  const entries = fs.readdirSync(POSTS_DIR, { withFileTypes: true });
  const posts: Post[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === "drafts") continue;

    const dir = path.join(POSTS_DIR, entry.name);
    const mdxFile = fs
      .readdirSync(dir)
      .find((f) => f.endsWith(".mdx") || f.endsWith(".md"));
    if (!mdxFile) continue;

    const filePath = path.join(dir, mdxFile);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const fm = data as PostFrontmatter;

    if (!fm.slug) {
      throw new Error(`Post is missing 'slug' frontmatter: ${filePath}`);
    }

    const slug = normalizeSlug(fm.slug);
    const transformed = rewriteRelativeImages(
      normalizeCodeFences(content),
      slug,
    );

    posts.push({
      slug,
      rawSlug: fm.slug,
      frontmatter: fm,
      content: transformed,
      filePath,
    });
  }

  posts.sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}
