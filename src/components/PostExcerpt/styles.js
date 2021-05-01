import Img from 'gatsby-image'
import styled from 'styled-components'
import { mediaQueries } from 'utils/mediaQueries'

export const Post = styled.article`
  height: 100%;
  width: 100%;
  display: grid;
  border-radius: 0.5em;
  box-shadow: rgb(1 1 1 / 5%) 1px 1px 5px 0px;
  transition: transform 250ms ease 0s, box-shadow 250ms ease 0s, color 250ms ease 0s;
  background: var(--color-boxBackground);
  overflow: hidden;
  &:hover, &:focus {
    transform: translateY(-0.25rem);
    box-shadow: rgb(0 0 0 / 12%) 0px 2px 4px, rgb(0 0 0 / 12%) 0px 5px 10px;
  }
  .cover-wrap {
    padding: 0.7rem;
    a {
      display: flex;
    }
  }
  > :not(:first-child) {
    margin-left: 20px;
    margin-right: 20px;
  }
  > :last-child {
    margin-bottom: 0.5em;
    line-height: 3rem;
  }
  p {
    margin: 0 0 1rem 0;
  }
`

export const Cover = styled(Img).attrs(
  ({ fluid, src }) => !fluid && src && { as: `img` }
)`
  height: calc(10em + 4vh);
  width: 100%;
  object-fit: cover;
  border-radius: 5px 5px 0 0;
  ${mediaQueries.maxLaptop} {
    height: calc(8em + 4vh);
  }
`
