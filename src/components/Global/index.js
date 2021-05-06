import { MDXProvider } from '@mdx-js/react'
import { graphql, useStaticQuery } from 'gatsby'
import React, { useEffect }  from 'react'
import SyntaxHighlight from 'utils/syntaxHighlight'
import Footer from '../Footer'
import Header from '../Header'
import { LazyPlot } from '../Plotly'
import Scroll from '../Scroll'
import SEO from '../Seo'
import { DocsGrid } from '../styles'
import { GlobalStyle } from './styles'
import "@fontsource/megrim"

const components = { LazyPlot, DocsGrid }


export const Providers = ({ children }) => (
  <MDXProvider components={components}>
    {children}
    <Scroll showBelow={1500} css="position: fixed; right: 1em; bottom: 1em;" />
  </MDXProvider>
)



export function PageComponents({ children, ...rest }) {
  const { site } = useStaticQuery(graphql`
    {
      site {
        site: siteMetadata {
          title
          url
          description
        }
      }
    }
  `)
  return (
    <>
      <GlobalStyle />
      <SyntaxHighlight />
      <SEO title="CSS Widgets" />
      <a href="#skip-to-main-content" className="skip-main">Skip to content</a>
      <Header {...site} />
      {children}
      <Footer />
    </>
  )
}
