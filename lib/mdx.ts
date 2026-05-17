import type { PluggableList } from "unified";
import remarkSmartypants from "remark-smartypants";
import remarkSupersub from "remark-supersub";
import remarkEmoji from "remark-emoji";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";

const remarkPlugins: PluggableList = [
  remarkSmartypants,
  remarkSupersub,
  remarkEmoji,
];

const rehypePlugins: PluggableList = [
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
];

export const mdxOptions = {
  parseFrontmatter: false as const,
  mdxOptions: {
    remarkPlugins,
    rehypePlugins,
  },
};
