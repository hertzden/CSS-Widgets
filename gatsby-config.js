const macros = require(`./src/utils/katex`)
const rssOptions = require(`./src/utils/rss`)
const sitemapOptions = require(`./src/utils/sitemap`)

require(`dotenv`).config()

const siteMetadata = {
  title: `CSS Widgets`,
  description: `Front-end Technologies | CSS, HTML, Accessibility.`,
  author: `Harshit Purwar`,
  url: `css-widgets.com`,
  social: {
      twitter: `harshitpurwar`,
  },
}

const gatsbyRemarkPlugins = [
  `gatsby-remark-smartypants`,
  `gatsby-remark-embed-video`,
  `gatsby-remark-responsive-iframe`,
  `gatsby-remark-copy-linked-files`,
  `gatsby-remark-code-titles`,
  `gatsby-remark-sub-sup`,
  `gatsby-remark-autolink-headers`,
  {
    resolve: `gatsby-remark-vscode`,
    options: { extensions: [`mdx`, `vscode-styled-components`] },
  },
  {
    resolve: `gatsby-remark-katex`,
    options: { macros, throwOnError: false },
  },
  {
    resolve: `gatsby-remark-images`,
    options: {
      maxWidth: 1200,
      linkImagesToOriginal: false,
      wrapperStyle: `border-radius: 0.5em; overflow: hidden;`,
    },
  },
  {
    resolve: `gatsby-remark-emojis`,
    options: { active: true, size: 24 },
  },
]

const plugins = [
  {
    resolve: `gatsby-plugin-mdx`,
    options: {
      gatsbyRemarkPlugins,
      plugins: [`gatsby-remark-images`, `gatsby-remark-autolink-headers`],
      extensions: [`.mdx`, `.md`],
    },
  },
  {
    resolve: `gatsby-transformer-sharp`,
    options: {
      // https://github.com/gatsbyjs/gatsby/issues/21776#issuecomment-604924320
      checkSupportedExtensions: false,
    },
  },
  `gatsby-plugin-sharp`,
  `gatsby-transformer-yaml`,
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      path: `${__dirname}/content`,
      ignore: [`**/posts/drafts`],
    },
  },
  `gatsby-transformer-yaml`,
  `gatsby-plugin-catch-links`,
  `gatsby-plugin-styled-components`,
  {
    resolve: `gatsby-plugin-google-analytics`,
    options: {
      trackingId: `G-LHTW9V1F9R`,
    },
  },
  {
      resolve: `gatsby-plugin-disqus`,
      options: {
        shortname: `harshitpurwar`
      }
    },
  // {
  //   resolve: `gatsby-plugin-algolia`,
  //   options: {
  //     appId: process.env.GATSBY_ALGOLIA_APP_ID,
  //     apiKey: process.env.ALGOLIA_ADMIN_KEY,
  //     queries,
  //     chunkSize: 10000, // default: 1000
  //   },
  // },
  {
    resolve: `gatsby-plugin-feed`,
    options: rssOptions,
  },
  {
    resolve: `gatsby-plugin-sitemap`,
    options: sitemapOptions,
  },
  {
    resolve: `gatsby-plugin-manifest`,
    options: {
      name: siteMetadata.title,
      short_name: siteMetadata.title,
      display: `standalone`,
      icon: `content/favicon.svg`,
      background_color: `#150956`,
      theme_color: `#150956`,
    },
  },
  `gatsby-plugin-lodash`,
  `gatsby-plugin-react-helmet`,
  `gatsby-plugin-netlify-cache`,
]

module.exports = { siteMetadata, plugins }
