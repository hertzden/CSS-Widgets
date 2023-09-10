import PageTitle from 'components/PageTitle'
import { PageBody, Wrapper, Mode, ModeDevice } from 'components/styles'
import './style.css'
import TagList from 'components/TagList'
import { graphql } from 'gatsby'
import { useQueryParam } from 'hooks'
import React from 'react'
import PostList from 'views/PostList'
import Connect from 'components/Connect'


const insertAllTag = (tags, count) =>
  !tags.map(tag => tag.title).includes(`All`) &&
  tags.unshift({ title: `All`, count })

const filterPostsByTag = (tag, posts) =>
  // If !tag, tag is null which stands for all posts.
  posts.filter(post => !tag || post.frontmatter.tags.includes(tag))

export default function IndexPage({ data }) {
  const { allMdx, img } = data
  const { posts, tags } = allMdx
  const [activeTag, setActiveTag] = useQueryParam(`tag`)
  insertAllTag(tags, posts.length)
  const filteredPosts = filterPostsByTag(activeTag, posts)
  return (
    <>
      {/*<PageTitle img={img}>
        <h1>Blog</h1>
      </PageTitle>*/}
      <Wrapper id="skip-to-main-content">
        <PageBody className="google-auto-placed">
          <ModeDevice>
            <TagList {...{ tags, activeTag, setActiveTag }} />
          </ModeDevice>
          <PostList inBlog posts={filteredPosts} />
          
          <aside className="sidebar">
            <div className="sidebar-wrap">
              <Mode>
                <TagList {...{ tags, activeTag, setActiveTag }} />
              </Mode>
              <Connect />
            </div>
          </aside>
        </PageBody>
      </Wrapper>
    </>
  )
}

export const query = graphql`
  {
    allMdx(
      filter: { fileAbsolutePath: { regex: "/posts/" } }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      posts: nodes {
        ...page
      }
      tags: group(field: frontmatter___tags) {
        title: fieldValue
        count: totalCount
      }
    }
    img: file(name: { eq: "blog-banner" }) {
      ...sharpSrc
    }
  }
`
