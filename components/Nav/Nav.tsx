"use client";

import { useState } from "react";
import Link from "next/link";
import { navLinks } from "@/lib/site";
import styles from "./Nav.module.css";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={styles.opener}
        aria-label="Open navigation"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className={styles.openerBar} />
        <span className={styles.openerBar} />
        <span className={styles.openerBar} />
      </button>

      <nav
        className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}
        aria-label="Site navigation"
      >
        <button
          type="button"
          className={styles.closer}
          aria-label="Close navigation"
          aria-expanded={open}
          onClick={() => setOpen(false)}
        >
          ×
        </button>
        <ul className={styles.list}>
          {navLinks.map((link) => (
            <li key={link.url}>
              <Link
                href={link.url}
                className={styles.link}
                onClick={() => setOpen(false)}
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
