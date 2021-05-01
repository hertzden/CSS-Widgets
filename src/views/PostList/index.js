import React from 'react'
import PostExcerpt from 'components/PostExcerpt'
import { PostGridWrapper, PostGrid, PostGridAlt } from './styles'

export default function PostList({ posts, noText, ...rest }) {
  return (
    <>
    <PostGridWrapper>
    <h2>Recently Published</h2>
    {/*<PostGrid minWidth="36rem" maxWidth="24rem" gap="4rem" {...rest}>*/}
    <PostGridAlt>
      {posts.map(post => (
        <PostExcerpt key={post.frontmatter.slug} post={post} noText={noText} />
      ))}
    </PostGridAlt>

    </PostGridWrapper>
    </>
  )
}
