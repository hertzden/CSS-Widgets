"use client";

import { useEffect, useState } from "react";
import styles from "./Toc.module.css";

type Heading = { id: string; text: string; depth: number };

export function Toc({ selector = "article h2, article h3" }: { selector?: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | undefined>();

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(selector),
    ).filter((n) => n.id);
    setHeadings(
      nodes.map((n) => ({
        id: n.id,
        text: n.textContent ?? "",
        depth: Number(n.nodeName[1]),
      })),
    );

    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0.1 },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [selector]);

  if (headings.length === 0) return null;
  const minDepth = Math.min(...headings.map((h) => h.depth));

  return (
    <nav className={styles.toc} aria-label="Table of contents">
      <p className={styles.tocTitle}>Contents</p>
      <ul className={styles.list}>
        {headings.map((h) => (
          <li
            key={h.id}
            className={`${styles.item} ${activeId === h.id ? styles.active : ""}`}
            style={{ paddingLeft: `${(h.depth - minDepth) * 1.2}rem` }}
          >
            <a href={`#${h.id}`}>{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
