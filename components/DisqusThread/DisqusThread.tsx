"use client";

import { DiscussionEmbed } from "disqus-react";
import styles from "./DisqusThread.module.css";

const SHORTNAME = process.env.NEXT_PUBLIC_DISQUS_NAME;

export function DisqusThread({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  if (!SHORTNAME) return null;
  return (
    <section className={styles.thread} id="disqus_thread">
      <DiscussionEmbed
        shortname={SHORTNAME}
        config={{ identifier: slug, title, url: undefined }}
      />
    </section>
  );
}
