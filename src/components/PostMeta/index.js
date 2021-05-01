import { CommentCount } from 'disqus-react'
import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import { Comment } from 'styled-icons/boxicons-regular'
import { Timer } from 'styled-icons/material'
import { Calendar } from 'styled-icons/bootstrap'
import { disqusConfig } from 'templates/post'
import { Meta, TagList } from './styles'

const PostMeta = ({ title, slug, date, timeToRead, tags, inTitle = false }) => (
  <Meta inTitle={inTitle}>
    <span>
      <Calendar size="1.4rem" />
      &ensp;
      {date}
    </span>
    <span>
      <Timer size="1.6rem" />
      &ensp;
      {timeToRead} min read
    </span>
    <span>
      <Comment size="1.6rem" />
      &ensp;
      <Link to={slug + `#disqus_thread`}>
        <CommentCount {...disqusConfig({ slug, title })} />
      </Link>
    </span>
    <TagList tags={tags} />
  </Meta>
)

export default PostMeta

PostMeta.propTypes = {
  date: PropTypes.string.isRequired,
  timeToRead: PropTypes.number.isRequired,
  inTitle: PropTypes.bool,
}
