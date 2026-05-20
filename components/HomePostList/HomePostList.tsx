"use client";

import { useState } from "react";
import { PostExcerpt } from "@/components/PostExcerpt/PostExcerpt";
import { TagList } from "@/components/TagList/TagList";
import { Connect } from "@/components/Connect/Connect";
import styles from "./HomePostList.module.css";

type ListPost = {
  slug: string;
  title: string;
  date: string;
  timeToRead: number;
  tags?: readonly string[];
  excerpt: string;
  coverSrc?: string;
};

export function HomePostList({
  posts,
  tags,
}: {
  posts: readonly ListPost[];
  tags: readonly { title: string; count: number }[];
}) {
  const [activeTag, setActiveTag] = useState<string | undefined>();
  const filtered = activeTag
    ? posts.filter((p) => p.tags?.includes(activeTag))
    : posts;

  return (
    <div className={styles.layout}>
      <section className={styles.content}>
        <h2 className={styles.sectionHeading}>Recently Published</h2>
        <div className={styles.mobileFilter}>
          <TagList tags={tags} activeTag={activeTag} onSelect={setActiveTag} />
        </div>
        <div className={styles.list}>
          {filtered.map((post) => (
            <PostExcerpt key={post.slug} {...post} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className={styles.empty}>
            No posts tagged &quot;{activeTag}&quot;.
          </p>
        )}
      </section>
      <aside className={styles.sidebar}>
        <div className={styles.desktopFilter}>
          <h2 className={styles.sectionHeading}>Tags</h2>
          <TagList tags={tags} activeTag={activeTag} onSelect={setActiveTag} />
        </div>
        <Connect />
      </aside>
    </div>
  );
}
