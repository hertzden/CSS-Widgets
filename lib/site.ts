export const siteMetadata = {
  title: "CSS Widgets",
  description: "Front-end Technologies | CSS, HTML, Accessibility.",
  author: "Harshit Purwar",
  url: "https://css-widgets.com",
  social: {
    twitter: "harshitpurwar",
  },
} as const;

export const navLinks = [
  { title: "Snippets", url: "/snippets" },
  { title: "Guides", url: "/guides" },
  { title: "About", url: "/about" },
] as const;

export const footerContent = {
  copyright: "All Rights Reserved.",
  poweredBy: [
    { title: "Next.js", url: "https://nextjs.org" },
    { title: "Netlify", url: "https://netlify.com" },
  ],
} as const;
