import Img from 'gatsby-image'
import styled from 'styled-components'
import { mediaQueries } from 'utils/mediaQueries'

export const Post = styled.article`
  height: 100%;
  width: 100%;
  display: grid;
  grid-auto-flow: row;
  border-radius: 10px;
  box-shadow: rgb(1 1 1 / 5%) 1px 1px 5px 0px;
  transition: transform 250ms ease 0s, box-shadow 250ms ease 0s, color 250ms ease 0s;
  background: var(--color-boxBackground);
  overflow: hidden;
  ${mediaQueries.minPhone} {
    grid-auto-flow: column;
  }
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
  h3 {
    font-size: 2.2rem;
    line-height: 3rem;
    margin: 1.5rem auto 1rem;
    color: var(--color-heading);
    a {
      color: var(--color-postHeading);
    }
  }
  > :not(:first-child) {
    margin-left: 20px;
    margin-right: 20px;
  }
  > :last-child {
    line-height: 3rem;
    margin-bottom: 1rem;
    ${mediaQueries.minLaptop} {
      margin-bottom: 0;
    }
  }
  p {
    margin: 0 0 1.5rem 0;
    font-size: 1.6rem;
    letter-spacing: 0.5px;
    -webkit-font-smoothing: antialiased;
  }
  .read-more {
    display: inline-flex;
    align-items: center;
    justify-self: flex-end;
    background: #077b88;
    margin: 0;
    max-width: fit-content;
    padding: 2px 12px;
    color: #fff;
    font-weight: 400;
    border-radius: 15px 0 10px 0;
    font-size: 1.4rem;
  }
`

export const Cover = styled(Img).attrs(
  ({ fluid, src }) => !fluid && src && { as: `img` }
)`
  height: calc(10em + 4vh);
  width: 100%;
  object-fit: cover;
  border-radius: 6px 6px 2px 2px;
  ${mediaQueries.minLaptop} {
    border-radius: 6px 2px 2px 6px;
  }
  ${mediaQueries.minPhone} {
    height: calc(12.5em + 4vh);
    border-radius: 6px 2px 2px 6px;
  }
`
