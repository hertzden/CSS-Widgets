import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const WORDS_PER_MINUTE = 200;

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
  timeToRead: number;
};

export type TagCount = { title: string; count: number };

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

function normalizeDate(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "string") {
    return value.slice(0, 10);
  }
  return "";
}

function countWords(input: string): number {
  return input.trim().split(/\s+/).filter(Boolean).length;
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
    const normalizedFm: PostFrontmatter = {
      ...fm,
      date: normalizeDate(fm.date),
    };
    const timeToRead = Math.max(1, Math.ceil(countWords(content) / WORDS_PER_MINUTE));

    posts.push({
      slug,
      rawSlug: fm.slug,
      frontmatter: normalizedFm,
      content: transformed,
      filePath,
      timeToRead,
    });
  }

  posts.sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getAdjacentPosts(slug: string): {
  prev: Post | undefined;
  next: Post | undefined;
} {
  const posts = getAllPosts();
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: undefined, next: undefined };
  // Posts are sorted newest-first, so prev (newer) is at idx-1; next (older) is at idx+1.
  return {
    prev: posts[idx - 1],
    next: posts[idx + 1],
  };
}

export function getAllTags(): TagCount[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.frontmatter.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts, ([title, count]) => ({ title, count })).sort(
    (a, b) => b.count - a.count || a.title.localeCompare(b.title),
  );
}
