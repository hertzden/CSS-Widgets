import Link from "next/link";
import Image from "next/image";
import { Nav } from "@/components/Nav/Nav";
import { DarkToggle } from "@/components/DarkToggle/DarkToggle";
import { siteMetadata } from "@/lib/site";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          href="/"
          title={siteMetadata.title}
          rel="home"
          className={styles.logo}
        >
          <Image
            src="/images/logo.svg"
            alt="CSS Widgets Logo"
            width={70}
            height={70}
            className={styles.logoMark}
            priority
          />
          <span
            className={styles.logoText}
            role="img"
            aria-label={siteMetadata.title}
          />
        </Link>
        <div className={styles.toggleMobile}>
          <DarkToggle />
        </div>
        <Nav />
        <div className={styles.toggleDesktop}>
          <DarkToggle />
        </div>
      </div>
      <div className={styles.hero} aria-hidden="true">
        <svg
          preserveAspectRatio="none"
          width="100%"
          height="74"
          viewBox="0 0 1440 74"
          className={styles.heroSvg}
        >
          <path d="M456.464 0.0433865C277.158 -1.70575 0 50.0141 0 50.0141V74H1440V50.0141C1440 50.0141 1320.4 31.1925 1243.09 27.0276C1099.33 19.2816 1019.08 53.1981 875.138 50.0141C710.527 46.3727 621.108 1.64949 456.464 0.0433865Z" />
        </svg>
      </div>
    </header>
  );
}
