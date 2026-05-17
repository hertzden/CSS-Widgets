import { graphql } from 'gatsby'

export const query = graphql`
  fragment page on Mdx {
    frontmatter {
      title
      slug
      date(formatString: "MMMM D, YYYY")
      tags
      showToc
      ...cover
    }
    timeToRead
    excerpt(pruneLength: 120)
    body
  }
`
