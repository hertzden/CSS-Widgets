import { formatDate } from "@/lib/date";
import styles from "./PostMeta.module.css";

export function PostMeta({
  date,
  timeToRead,
  tags,
  variant = "card",
}: {
  date: string;
  timeToRead: number;
  tags?: readonly string[];
  variant?: "card" | "hero";
}) {
  return (
    <p
      className={`${styles.meta} ${variant === "hero" ? styles.hero : ""}`}
    >
      <span className={styles.item}>
        <time dateTime={date}>{formatDate(date)}</time>
      </span>
      <span className={styles.dot} aria-hidden="true">·</span>
      <span className={styles.item}>{timeToRead} min read</span>
      {tags && tags.length > 0 && (
        <>
          <span className={styles.dot} aria-hidden="true">·</span>
          <span className={styles.tags}>
            {tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </span>
        </>
      )}
    </p>
  );
}
