import Link from "next/link";
import Image from "next/image";
import { PostMeta } from "@/components/PostMeta/PostMeta";
import styles from "./PostExcerpt.module.css";

type Props = {
  slug: string;
  title: string;
  date: string;
  timeToRead: number;
  tags?: readonly string[];
  excerpt: string;
  coverSrc?: string;
};

export function PostExcerpt({
  slug,
  title,
  date,
  timeToRead,
  tags,
  excerpt,
  coverSrc,
}: Props) {
  return (
    <article className={styles.card}>
      {coverSrc && (
        <div className={styles.coverWrap}>
          <Link href={`/${slug}`} className={styles.coverLink}>
            <Image
              src={coverSrc}
              alt={`Cover image for ${title}`}
              className={styles.cover}
              width={300}
              height={200}
              unoptimized
            />
          </Link>
        </div>
      )}
      <div className={styles.body}>
        <h3 className={styles.heading}>
          <Link href={`/${slug}`}>{title}</Link>
        </h3>
        <PostMeta date={date} timeToRead={timeToRead} tags={tags} />
        <p className={styles.excerpt}>{excerpt}</p>
        <Link href={`/${slug}`} className={styles.readMore}>
          Read more →
        </Link>
      </div>
    </article>
  );
}
