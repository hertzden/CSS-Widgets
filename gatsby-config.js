const rssOptions = require(`./src/utils/rss`)


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
  `gatsby-plugin-sitemap`,
  `gatsby-transformer-remark`,
  `gatsby-remark-embedder`,
  {
    resolve: `gatsby-remark-vscode`,
    options: { extensions: [`mdx`, `vscode-styled-components`] },
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
      plugins: [`gatsby-remark-images`, `gatsby-remark-autolink-headers`, `@weknow/gatsby-remark-codepen`, `gatsby-remark-embedder`],
      extensions: [`.mdx`, `.md`],
    },
  },
  {
  resolve: `gatsby-remark-embedder`,
    options: {
    customTransformers: [
      // Your custom transformers
    ],
    services: {
      // The service-specific options by the name of the service
      
    },
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
    resolve:"@weknow/gatsby-remark-codepen",
    options: {
      theme: "dark",
      height: 400
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
]

module.exports = {
  siteMetadata,
  plugins,
  flags: {
      PRESERVE_FILE_DOWNLOAD_CACHE: true,
      PRESERVE_WEBPACK_CACHE: true
    }
  }
