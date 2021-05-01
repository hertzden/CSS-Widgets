import styled, { css } from 'styled-components'
import { Grid } from 'components/styles'
import { mediaQueries } from 'utils/mediaQueries'

const asRow = css`
  grid-column: 2/-2;
  grid-auto-flow: column;
  overflow: scroll;
  grid-auto-columns: 18em;
  padding: 1em;
`

const inBlog = css`
  ${mediaQueries.maxPhablet} {
    grid-column: 3;
    justify-self: center;
  }
  ${mediaQueries.minPhablet} {

  }
`

export const PostGridWrapper = styled.div`
  margin-bottom: 5rem;
  ${mediaQueries.minTablet} {
    padding: 0;
  }
h2 {
  margin: 0 0 3rem 0;
  font-size: 2.4rem;
  font-weight: 600;
  text-transform: uppercase;
  position: relative;
  padding-left: 3rem;
}
h2::before {
    display: block;
    background-color:#f86377;
    content: "";
    border-radius: 9999px;
    position: absolute;
    height: 100%;
    width: 5px;
    top: 0px;
    left: 0px;
}
`

export const PostGridAlt = styled.div`
  display: grid;
  grid-template-columns: repeat( auto-fill,minmax(36rem,1fr));
  grid-gap: 4rem;
  ${mediaQueries.maxLaptop} {
    grid-template-columns: repeat( auto-fill,minmax(32rem,1fr));
    grid-gap: 2rem;
  }
`

export const PostGrid = styled(Grid)`
  height: max-content;
  ${props => props.asRow && asRow};
  ${props => props.inBlog && inBlog};
`;
