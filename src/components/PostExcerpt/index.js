import { Link } from 'gatsby'
import React from 'react'
import PostMeta from '../PostMeta'
import { Cover, Post } from './styles'
import { ArrowheadRightOutline } from 'styled-icons/evaicons-outline'

export default function PostExcerpt({ post, noText }) {
  const { frontmatter, excerpt, timeToRead } = post
  const { title, slug, cover } = frontmatter
  return (
    <Post>
      <div className="cover-wrap">
        <Link to={slug}>
          <Cover {...cover} {...cover.img} />
        </Link>
      </div>
      <div>
        <h3>
          <Link to={slug}>{title}</Link>
        </h3>
        <PostMeta {...{ ...frontmatter, timeToRead }} />
        {!noText && <p dangerouslySetInnerHTML={{ __html: excerpt }} />}
        <Link className="read-more" to={slug}>Read more <ArrowheadRightOutline size="1.6rem" /> <span className="sr-only">about {title}</span> </Link>
        </div>
    </Post>
  )
}
