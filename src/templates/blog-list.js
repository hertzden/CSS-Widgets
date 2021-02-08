import React from 'react'
import { Link, graphql } from 'gatsby'
import styles from './Bloglist.module.scss';

import SEO from '../components/seo'

import Layout from '../components/layout'


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
        title="CSS Widgets"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />

        <div className={`grid grid-cols-2 md:grid-cols-none gap-10 md:gap-6 sm:gap-4 mb-8 p-4 md:p-0`}>
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
              <p className={`mb-5 md:mb-3`} dangerouslySetInnerHTML={{ __html: node.excerpt }} />
              <Link to={node.fields.slug} className={`hvr-sweep-to-right mb-2 inline-block primary-button ${styles.more_button}`}>
                Continue Reading <span className='font-2 ml-0.5' aria-hidden="true">&#187;</span>
              </Link>
            </article>
          )
        })}
        </div>
        <nav aria-label="pagination" className="flex justify-center">
        <ul className="pagination flex">
          {!isFirst && (
            <li>
            <Link className="previous sm:pagination-link" to={`../${prevPage}`} rel="prev">
              <span>←</span> <span className="sm:hide-mobile">Previous Page</span>
            </Link>
            </li>
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
                  background: i + 1 === currentPage ? 'hsla(230, 92%, 61%, 1)' : '',
                  borderColor: i + 1 === currentPage ? 'hsla(230, 92%, 61%, 1)' : '',
                }}
              >
                {i + 1}
              </Link>
            </li>
          ))}
          {!isLast && (
            <li>
            <Link className="next sm:pagination-link" to={`../${nextPage}`} rel="next">
               <span className="sm:hide-mobile">Next Page</span> <span>→</span>
            </Link>
            </li>
          )}
        </ul>
        </nav>
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query blogPageQuery($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
            titleC
          }
          timeToRead
        }
      }
    }
  }
`
