"use client";

import styles from "./TagList.module.css";

type Tag = { title: string; count: number };

export function TagList({
  tags,
  activeTag,
  onSelect,
}: {
  tags: readonly Tag[];
  activeTag?: string;
  onSelect: (tag: string | undefined) => void;
}) {
  const all = { title: "All", count: tags.reduce((s, t) => s + t.count, 0) };
  const allTags = [all, ...tags];
  return (
    <div className={styles.list} role="group" aria-label="Filter posts by tag">
      {allTags.map((tag) => {
        const isAll = tag.title === "All";
        const isActive = isAll ? !activeTag : activeTag === tag.title;
        return (
          <button
            key={tag.title}
            type="button"
            className={`${styles.tag} ${isActive ? styles.active : ""}`}
            aria-pressed={isActive}
            onClick={() => onSelect(isAll ? undefined : tag.title)}
          >
            {tag.title}
            <span className={styles.count}>{tag.count}</span>
          </button>
        );
      })}
    </div>
  );
}
