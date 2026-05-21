import { footerContent } from "@/lib/site";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.wrap}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} CSS Widgets — {footerContent.copyright}
        </p>
        <p className={styles.poweredBy}>
          Powered by{" "}
          {footerContent.poweredBy.map((p, i, arr) => (
            <span key={p.title}>
              <a href={p.url} target="_blank" rel="noopener noreferrer">
                {p.title}
              </a>
              {i < arr.length - 1 ? " · " : ""}
            </span>
          ))}
        </p>
      </div>
    </footer>
  );
}
