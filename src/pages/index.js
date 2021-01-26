import React from "react"
import { Link, graphql } from "gatsby"
import styles from '../templates/Bloglist.module.scss';


import Layout from "../components/layout"
import SEO from "../components/seo"


//const BlogIndex = ({ data, location }) => {
class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges
    const { currentPage, numPages } = this.props.pageContext
    const isFirst = currentPage === 1
    const isLast = currentPage === numPages
    const prevPage = currentPage - 1 === 1 ? '/' : (currentPage - 1).toString()
    const nextPage = (currentPage + 1).toString()

  return (
    <Layout location={this.props.location} title={siteTitle}>
      <SEO
        title={siteTitle}
        keywords={[`blog`, `gatsby`, `javascript`, `react`]}
      />

      <div className="grid grid-cols-2 gap-10 mb-8 p-4">
      {posts.map(({ node }) => {
        const title = node.frontmatter.title || node.fields.slug
        const titleC = node.frontmatter.titleC
        return (

          <article key={node.fields.slug} className="card">
          <header className="relative">
            <h2 className={`heading-two  ${styles.blog_list_heading}`}>
              <Link to={node.fields.slug}>
                {title}
              </Link>
            </h2>
            <div className="text-gray mb-2 mt-1 font-1 block">Published on: {node.frontmatter.date} / {node.timeToRead} min read</div>
            <div aria-hidden="true" className={`absolute ${styles.post_title}`}>{titleC}</div>
            </header>
            <p className="mb-5" dangerouslySetInnerHTML={{ __html: node.excerpt }} />
            <Link to={node.fields.slug} className={`hvr-sweep-to-right mb-2 inline-block ${styles.more_button}`}>
              Continue Reading <span className='font-2 ml-0.5' aria-hidden="true">&#187;</span>
            </Link>
          </article>
        )
      })}
      </div>
      <nav aria-label="pagination" className="flex justify-center">
      <ul className="pagination flex"
        // style={{
        //   display: 'flex',
        //   flexWrap: 'wrap',
        //   justifyContent: 'center',
        //   alignItems: 'center',
        //   listStyle: 'none',
        //   padding: 0,
        // }}
      >
        {!isFirst && (
          <Link className="" to={`../${prevPage}`} rel="prev">
            ← Previous Page
          </Link>
        )}
        {Array.from({ length: numPages }, (_, i) => (
          <li className={`${styles.pagination_list__item}`}
            key={`pagination-number${i + 1}`}

          >
            <Link className="pagination-link"
              to={`/${i === 0 ? '' : i + 1}`}
              style={{

                textDecoration: 'none',
                color: i + 1 === currentPage ? '#ffffff' : '',
                background: i + 1 === currentPage ? '#007acc' : '',
                borderColor: i + 1 === currentPage ? '#007acc' : '',
              }}
            >
              {i + 1}
            </Link>
          </li>
        ))}
        {!isLast && (
          <Link className="" to={`../${nextPage}`} rel="next">
            Next Page →
          </Link>
        )}
      </ul>
      </nav>
    </Layout>
  )
}
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            titleC
          }
        }
      }
    }
  }
`
