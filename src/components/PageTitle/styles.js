import Image from 'gatsby-image'
import styled from 'styled-components'
import { mediaQueries } from 'utils/mediaQueries'

export const PageTitleDiv = styled.hgroup`
  position: relative;
  color: var(--color-text);
  /* Use flex instead of grid. Else Safari messes up vertical alignment of children. */
  display: flex;
  flex-direction: column;
  place-content: center;
  min-height: 5rem;
  flex: 1; /* for filling height between header and footer on 404 page */
  font-size: 1.4rem;
  text-align: center;
  overflow: hidden;
  padding: 0 2rem;
  h1 {
    font-weight: 600;
    font-size: 4.4rem;
    line-height: 4.8rem;
    margin: 1rem 0;
    ${mediaQueries.minTablet} {
      font-size: 5.4rem;
    }
  }
  /* prettier-ignore */
  > :not(:first-child):not(svg):not(figcaption) {
    place-self: center;
    border-radius: 0.2em;
    padding: 0.1em 0.4em;
    margin: 1em;
  }
  a {
    color: var(--color-link);
  }
`

export const Img = styled(Image).attrs(
  p => !p.fluid && p.src && { as: `img`, src: p.dataURI || p.src }
)`
  position: absolute !important;
  z-index: -1;
  width: 100%;
  height: 100%;
  object-fit: cover;
`
