import Link from "next/link";
import { PostMeta } from "@/components/PostMeta/PostMeta";
import styles from "./PostExcerpt.module.css";

type Props = {
  slug: string;
  title: string;
  date: string;
  timeToRead: number;
  tags?: readonly string[];
  description?: string;
  coverSrc?: string;
};

export function PostExcerpt({
  slug,
  title,
  date,
  timeToRead,
  tags,
  description,
  coverSrc,
}: Props) {
  return (
    <article className={styles.card}>
      {coverSrc && (
        <Link href={`/${slug}`} className={styles.coverLink}>
          <span
            className={styles.cover}
            role="img"
            aria-label={`Cover image for ${title}`}
            style={{ backgroundImage: `url("${coverSrc}")` }}
          />
        </Link>
      )}
      <div className={styles.body}>
        <h2 className={styles.heading}>
          <Link href={`/${slug}`}>{title}</Link>
        </h2>
        <PostMeta date={date} timeToRead={timeToRead} tags={tags} />
        {description && <p className={styles.description}>{description}</p>}
        <Link href={`/${slug}`} className={styles.readMore}>
          Read more →
        </Link>
      </div>
    </article>
  );
}
