import fs from "node:fs";
import path from "node:path";
import { getAllPosts } from "./posts";

const PUBLIC_POSTS_DIR = path.join(process.cwd(), "public", "posts");

function copyAssetsForPost(postDir: string, slug: string): number {
  const targetDir = path.join(PUBLIC_POSTS_DIR, slug);
  fs.mkdirSync(targetDir, { recursive: true });

  let copied = 0;
  for (const entry of fs.readdirSync(postDir, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    if (entry.name.endsWith(".md") || entry.name.endsWith(".mdx")) continue;

    const src = path.join(postDir, entry.name);
    const dst = path.join(targetDir, entry.name);
    fs.copyFileSync(src, dst);
    copied += 1;
  }
  return copied;
}

export function copyAllPostAssets(): { posts: number; assets: number } {
  fs.rmSync(PUBLIC_POSTS_DIR, { recursive: true, force: true });
  fs.mkdirSync(PUBLIC_POSTS_DIR, { recursive: true });

  let totalAssets = 0;
  const posts = getAllPosts();
  for (const post of posts) {
    const postDir = path.dirname(post.filePath);
    totalAssets += copyAssetsForPost(postDir, post.slug);
  }
  return { posts: posts.length, assets: totalAssets };
}

const isMain =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  process.argv[1] !== undefined &&
  process.argv[1].endsWith("assets.ts");

if (isMain) {
  const { posts, assets } = copyAllPostAssets();
  console.log(`copied ${assets} asset(s) for ${posts} post(s) into public/posts/`);
}
