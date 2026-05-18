import Link from "next/link";
import styles from "./PrevNext.module.css";

type Neighbour = { slug: string; title: string };

export function PrevNext({
  prev,
  next,
}: {
  prev?: Neighbour;
  next?: Neighbour;
}) {
  if (!prev && !next) return null;
  return (
    <nav className={styles.nav} aria-label="Post navigation">
      {prev ? (
        <Link href={`/${prev.slug}`} rel="prev" className={styles.prev}>
          <span className={styles.label}>← Previous post</span>
          <span className={styles.title}>{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={`/${next.slug}`} rel="next" className={styles.next}>
          <span className={styles.label}>Next post →</span>
          <span className={styles.title}>{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
