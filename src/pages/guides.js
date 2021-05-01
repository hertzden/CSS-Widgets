import PageTitle from 'components/PageTitle'
import Scroll from 'components/Scroll'
import { PageBody, Wrapper } from 'components/styles'
import { graphql, Link } from 'gatsby'
import Img from 'gatsby-image'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import React from 'react'
import styled, { css } from 'styled-components'
import { ArrowLeft, ArrowRight } from 'styled-icons/fa-solid'
import { mediaQueries } from 'utils/mediaQueries'
import PostList from 'views/PostList'
import Connect from 'components/Connect'

export default function LatestPage({ data }) {
  const { mdx, posts } = data
  return (
    <>
      {/*<PageTitle {...mdx.frontmatter.cover} css="min-height: 35em">
        <Title>
          {mdx.frontmatter.title.split(`, `).map(str => (
            <Link key={str} to={`/` + str.toLowerCase()}>
              {str}
            </Link>
          ))}
        </Title>
        <Scroll direction="down" to={1} />
      </PageTitle>*/}
      <Wrapper>
      <PageBody>
      
        {/*<H>Recent posts</H>*/}
        <PostList noText posts={posts.nodes} />
        {/*<H>Recent projects</H>*/}
        {/*<ProjectList asRow />*/}
        <aside className="sidebar">
          <div className="sidebar-wrap">
              <Connect />
            </div>
          </aside>
      </PageBody>
      </Wrapper>
    </>
  )
}

const Title = styled.h1`
  text-align: center;
  margin-top: 4em;
  padding: 0 !important;
  display: grid;
  a {
    padding: 0.4em;
    color: white;
    ${mediaQueries.maxPhone} {
      & + a {
        border-top: 0.5px solid rgba(255, 255, 255, 0.9);
      }
    }
  }
  ${mediaQueries.minPhone} {
    grid-template-columns: 1fr 1fr;
    a {
      :nth-child(2),
      :nth-child(3) {
        background: rgba(0, 0, 255, 0.2);
      }
    }
  }
`

const iconCss = css`
  width: 0.6em;
  vertical-align: 0;
  margin: 0 0.4em;
`

const H = ({ children, as }) => (
  <h1 as={as} css="text-align: center;">
    <ArrowLeft css={iconCss} />
    {children}
    <ArrowRight css={iconCss} />
  </h1>
)

export const query = graphql`
  {
    mdx(fileAbsolutePath: { regex: "/landing.md/" }) {
      frontmatter {
        title
        ...cover
      }
      body
    }
    posts: allMdx(
      filter: { fileAbsolutePath: { regex: "/posts/" } }
      sort: { fields: frontmatter___date, order: DESC }
      limit: 5
    ) {
      nodes {
        ...page
      }
    }
  }
`
