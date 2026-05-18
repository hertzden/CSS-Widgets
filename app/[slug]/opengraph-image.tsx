import { ImageResponse } from "next/og";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

export const dynamic = "force-static";
export const alt = "Post cover image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.frontmatter.title ?? "CSS Widgets";
  const tags = (post?.frontmatter.tags ?? []).slice(0, 3).join(" · ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #150956 0%, #2c0b8e 100%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <p style={{ fontSize: 32, opacity: 0.85, margin: 0 }}>
          css-widgets.com
        </p>
        <h1 style={{ fontSize: 72, fontWeight: 700, margin: 0, lineHeight: 1.15 }}>
          {title}
        </h1>
        <p style={{ fontSize: 30, opacity: 0.8, margin: 0 }}>{tags}</p>
      </div>
    ),
    size,
  );
}
