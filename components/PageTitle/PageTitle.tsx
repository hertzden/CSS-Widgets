import type { ReactNode } from "react";
import styles from "./PageTitle.module.css";

export function PageTitle({
  cover,
  children,
}: {
  cover?: { src: string; source?: string; url?: string };
  children: ReactNode;
}) {
  return (
    <section
      className={`${styles.title} ${cover ? styles.withCover : ""}`}
      style={cover ? { backgroundImage: `url("${cover.src}")` } : undefined}
    >
      <div className={styles.inner}>{children}</div>
      {cover?.source && cover?.url && (
        <a
          className={styles.attribution}
          href={cover.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Cover: {cover.source}
        </a>
      )}
    </section>
  );
}
