import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About CSS Widgets — a platform focused on CSS, HTML, Accessibility, and JavaScript.",
};

export default function AboutPage() {
  return (
    <>
      <h1>About CSS Widgets</h1>
      <p>
        Hello <span aria-label="waving hand" role="img">👋</span> reader, welcome to
        CSS Widgets — a platform focused on the basics of{" "}
        <strong>CSS, HTML, Accessibility, and JavaScript.</strong> Here you will
        learn and grow as a developer/designer irrespective of your experience.
      </p>
      <p>Here is what you will find on CSS Widgets:</p>
      <ul>
        <li>Practical tips to write accessible UI components.</li>
        <li>
          Basics of HTML semantics, CSS methodology, CSS Grid/Flex, color contrast,
          focus management, and ARIA.
        </li>
        <li>A community of like-minded developers/designers.</li>
        <li>Easy to customize and accessible code snippets.</li>
        <li>
          Complete "How-To" guides for Layouts, CSS Modules, CSS-in-JS, SASS, and
          Accessibility.
        </li>
        <li>Advanced guides and snippets on styling in Next.js.</li>
      </ul>
      <h2>Meet the Author</h2>
      <p>
        Hey, I'm <strong>Harshit Purwar.</strong> User Experience Engineer working on
        design systems, the JAMstack, accessibility, and user/developer experience.
      </p>
    </>
  );
}
