import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import TagPreview from "../components/tagWidget/TagPreview"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"
import styles from './Bloglist.module.scss';

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  const { previous, next } = pageContext
  const tags = post.frontmatter.tags || []

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article class="p-8">
          <header className="relative">
          <h1 className="heading-one heading-one--w-600 text-uppercase">
            {post.frontmatter.title}
          </h1>
          <div aria-hidden="true" className={`absolute ${styles.post_title__single}`}>{post.frontmatter.titleC}</div>
          <div className="text-gray mb-2 mt-1 font-1 block">Published on: {post.frontmatter.date} / {post.timeToRead} min read</div>


        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
        <TagPreview value={tags}/>
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
      
      </article>

      <nav>
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        titleC
        date(formatString: "MMMM DD, YYYY")
        description
        tags
      }
      wordCount {
        words
      }
      timeToRead
    }
  }
`
