import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import {
  getAllPosts,
  getPostBySlug,
  getAdjacentPosts,
} from "@/lib/posts";
import { mdxOptions } from "@/lib/mdx";
import { PageTitle } from "@/components/PageTitle/PageTitle";
import { PostMeta } from "@/components/PostMeta/PostMeta";
import { PrevNext } from "@/components/PrevNext/PrevNext";
import { Toc } from "@/components/Toc/Toc";
import { DisqusThread } from "@/components/DisqusThread/DisqusThread";
import type { Metadata } from "next";
import styles from "./post.module.css";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const description = post.frontmatter.description ?? post.excerpt;
  return {
    title: post.frontmatter.title,
    description,
    openGraph: {
      type: "article",
      title: post.frontmatter.title,
      description,
      publishedTime: post.frontmatter.date,
      tags: post.frontmatter.tags ? [...post.frontmatter.tags] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
    options: mdxOptions,
  });
  const { prev, next } = getAdjacentPosts(slug);

  const cover = post.frontmatter.cover
    ? {
        src: `/posts/${slug}/${post.frontmatter.cover.img}`,
        source: post.frontmatter.cover.source,
        url: post.frontmatter.cover.url,
      }
    : undefined;

  return (
    <>
      <PageTitle cover={cover}>
        <h1>{post.frontmatter.title}</h1>
        <PostMeta
          variant="hero"
          date={post.frontmatter.date}
          timeToRead={post.timeToRead}
          tags={post.frontmatter.tags}
        />
      </PageTitle>
      <div className={styles.layout}>
        {post.frontmatter.showToc && <Toc />}
        <article className={styles.article}>{content}</article>
      </div>
      <DisqusThread slug={post.slug} title={post.frontmatter.title} />
      <PrevNext
        prev={prev && { slug: prev.slug, title: prev.frontmatter.title }}
        next={next && { slug: next.slug, title: next.frontmatter.title }}
      />
    </>
  );
}
