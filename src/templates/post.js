import PageTitle from 'components/PageTitle'
import PostMeta from 'components/PostMeta'
import PrevNext from 'components/PrevNext'
import { PageBodySingle, PageWrapper, Wrapper } from 'components/styles'
import Toc from 'components/Toc'
import { DiscussionEmbed } from 'disqus-react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import React from 'react'
import Connect from 'components/Connect'
import SEO from 'components/Seo'

export const disqusConfig = ({ slug, title }) => ({
  shortname: process.env.GATSBY_DISQUS_NAME,
  config: { identifier: slug, title },
})

export default function PostTemplate({ data }) {
  const { post, next, prev } = data
  const { frontmatter, body, timeToRead } = post
  const { title, slug, cover, showToc } = frontmatter
  return (
    <>
      <SEO title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt} />
      <PageTitle>
        <h1>{title}</h1>
        <PostMeta inTitle {...{ ...frontmatter, timeToRead }} />
      </PageTitle>
      <Wrapper>
        <PageWrapper>
        {showToc && <Toc />}

        <article className="single-article"><MDXRenderer>{body}</MDXRenderer></article>
        <DiscussionEmbed {...disqusConfig({ slug, title })} />
        <PrevNext prev={prev?.frontmatter} next={next?.frontmatter} label="post" />
        </PageWrapper>
      </Wrapper>
    </>
  )
}

export const query = graphql`
  fragment adjacent on Mdx {
    frontmatter {
      title
      slug
      ...cover
    }
  }
  query($slug: String!, $prevSlug: String!, $nextSlug: String!) {
    post: mdx(frontmatter: { slug: { eq: $slug } }) {
      ...page
    }
    next: mdx(frontmatter: { slug: { eq: $nextSlug } }) {
      ...adjacent
    }
    prev: mdx(frontmatter: { slug: { eq: $prevSlug } }) {
      ...adjacent
    }
  }
`
