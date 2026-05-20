import { formatDate } from "@/lib/date";
import styles from "./PostMeta.module.css";

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="1.4rem"
      height="1.4rem"
      aria-hidden="true"
      fill="currentColor"
      className={styles.icon}
    >
      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
    </svg>
  );
}

function TimerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1.5rem"
      height="1.5rem"
      aria-hidden="true"
      fill="currentColor"
      className={styles.icon}
    >
      <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.962 8.962 0 0012 4c-4.97 0-9 4.03-9 9s4.02 9 9 9a8.994 8.994 0 007.03-14.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
    </svg>
  );
}

function TagsIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="1.4rem"
      height="1.4rem"
      aria-hidden="true"
      fill="currentColor"
      className={styles.icon}
    >
      <path d="M3 2v4.586l7 7L14.586 9l-7-7H3zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2z" />
      <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
    </svg>
  );
}

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
  const isHero = variant === "hero";
  return (
    <div className={`${styles.meta} ${isHero ? styles.hero : ""}`}>
      <p className={styles.row}>
        <span className={styles.item}>
          <CalendarIcon />
          <time dateTime={date}>{formatDate(date)}</time>
        </span>
        <span className={styles.item}>
          <TimerIcon />
          {timeToRead} min read
        </span>
      </p>
      {tags && tags.length > 0 && (
        <p className={`${styles.row} ${styles.tagsRow}`}>
          <span className={styles.item}>
            <TagsIcon />
            {tags.join(", ")}
          </span>
        </p>
      )}
    </div>
  );
}
