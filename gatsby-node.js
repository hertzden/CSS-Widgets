const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions


  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  return graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                titleC
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    // Create blog posts pages.
    const posts = result.data.allMarkdownRemark.edges

    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      createPage({
        path: post.node.fields.slug,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      })
    })

    // Create blog post list pages
    const postsPerPage = 5;
    const numPages = Math.ceil(posts.length / postsPerPage);

    Array.from({ length: numPages }).forEach((_, i) => {
      createPage({
        path: i === 0 ? `/` : `/${i + 1}`,
        component: path.resolve('./src/templates/blog-list.js'),
        context: {
          limit: postsPerPage,
          skip: i * postsPerPage,
          numPages,
          currentPage: i + 1
        },
      });
    });
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

// exports.createSchemaCustomization = ({ actions }) => {
//   const { createTypes } = actions
//   const typeDefs = `
//     type MarkdownRemark implements Node {
//       frontmatter: Frontmatter
//     }
//     type Frontmatter {
//       tags: [String!]!
//     }
//   `
//   createTypes(typeDefs)
// }

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions
  const typeDefs = [
    "type MarkdownRemark implements Node { frontmatter: Frontmatter }",
    schema.buildObjectType({
      name: "Frontmatter",
      fields: {
        tags: {
          type: "[String!]",
          resolve(source, args, context, info) {
            const { tags } = source
            if (source.tags == null || (Array.isArray(tags) && !tags.length)) {
              return []
            }
            return tags
          },
        },
      },
    }),
  ]
  createTypes(typeDefs)
}
