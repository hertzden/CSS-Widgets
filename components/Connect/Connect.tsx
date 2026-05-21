import styles from "./Connect.module.css";
import { siteMetadata } from "@/lib/site";

export function Connect() {
  return (
    <section className={styles.connect}>
      <h2 className={styles.heading}>Let&apos;s Talk</h2>
      <div className={styles.box}>
        <p className={styles.lead}>
          Want to find out how I can solve problems specific to
          HTML/CSS/Accessibility?
        </p>
        <div className={styles.social}>
          <p className={styles.cta}>Let&apos;s talk.</p>
          <a
            href={`https://twitter.com/${siteMetadata.social.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.icon}
            aria-label="Twitter profile"
          >
            <svg width="24" height="24" viewBox="0 0 800 800" aria-hidden="true">
              <path fill="currentColor" d="M679 239s-21 34-55 57c7 156-107 329-314 329-103 0-169-50-169-50s81 17 163-45c-83-5-103-77-103-77s23 6 50-2c-93-23-89-110-89-110s23 14 50 14c-84-65-34-148-34-148s76 107 228 116c-22-121 117-177 188-101 37-6 71-27 71-27s-12 41-49 61c30-2 63-17 63-17z" />
            </svg>
          </a>
          <a
            href="https://github.com/hertzden"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.icon}
            aria-label="GitHub profile"
          >
            <svg width="24" height="24" viewBox="0 0 800 800" aria-hidden="true">
              <path fill="currentColor" d="M400 139c144 0 260 116 260 260 0 115-75 213-178 247-9 3-17-2-17-13v-71c0-35-18-48-18-48 57-6 119-28 119-128 0-44-27-70-27-70s14-29-2-69c0 0-22-7-72 27-42-12-88-12-130 0-50-34-72-27-72-27-16 40-2 69-2 69s-27 26-27 70c0 100 62 122 119 128 0 0-14 10-17 35-15 7-53 18-76-22 0 0-13-25-39-27 0 0-26 0-2 16 0 0 17 8 29 38 0 0 16 51 88 35v44c0 11-9 16-18 13-103-34-178-132-178-247 0-144 116-260 260-260z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
