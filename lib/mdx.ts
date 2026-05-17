import remarkSmartypants from "remark-smartypants";
import remarkSupersub from "remark-supersub";
import remarkEmoji from "remark-emoji";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";

export const mdxOptions = {
  parseFrontmatter: false as const,
  mdxOptions: {
    remarkPlugins: [
      remarkSmartypants,
      remarkSupersub,
      remarkEmoji,
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: { className: ["heading-anchor"] },
        },
      ],
      [
        rehypePrettyCode,
        {
          theme: "github-dark-dimmed",
          keepBackground: true,
        },
      ],
    ],
  },
};
