"use client";

import { useState } from "react";
import { PostExcerpt } from "@/components/PostExcerpt/PostExcerpt";
import { TagList } from "@/components/TagList/TagList";
import styles from "./HomePostList.module.css";

type ListPost = {
  slug: string;
  title: string;
  date: string;
  timeToRead: number;
  tags?: readonly string[];
  description?: string;
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
    <>
      <TagList tags={tags} activeTag={activeTag} onSelect={setActiveTag} />
      <div className={styles.list}>
        {filtered.map((post) => (
          <PostExcerpt key={post.slug} {...post} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className={styles.empty}>No posts tagged "{activeTag}".</p>
      )}
    </>
  );
}
