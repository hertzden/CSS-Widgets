import styled from 'styled-components'
import { mediaQueries } from 'utils/mediaQueries'

export const Wrapper = styled.main`
  width: 100%;
  max-width: 1140px;
  min-height: 750px;
  margin: calc(1rem + 1vh) auto calc(3rem + 3vh);
`

export const PageBody = styled.div`
  position: relative;
  display: grid;
  grid-gap:0 6rem;
  grid-template-columns: 1fr;
  ${mediaQueries.minTablet} {
    grid-template-columns: 1fr minmax(15rem, 32rem);
    padding: 0;
  }
  ${mediaQueries.maxLaptop} {
    padding: 0 2rem;
    grid-gap:0 2rem;
    /* grid-template-columns: 1fr minmax(15rem, 29rem); */
  }
  @media only screen and (min-width: 48em) and (max-width: 64em) and (orientation: landscape) {
       grid-template-columns: 1fr minmax(15rem, 29rem);
  }

  {/*> * {
    grid-column: ${props => props.cols || 3};
  } */}
  /* Center image captions. */
  .gatsby-resp-image-wrapper + em,
  img + em,
  .js-plotly-plot + p > em,
  div.table + p > em {
    margin-top: 0.3em;
    display: block;
    text-align: center;
    max-width: 90%;
    margin-left: auto;
    margin-right: auto;
    font-size: 0.95em;
  }
  /* Center SVGs, not necessary for .gatsby-resp-image-wrapper */
  img {
    display: block;
    margin: auto;
  }
`
export const PageBodySingle = styled(PageBody)`
  grid-template-columns: 1fr ;
  ${mediaQueries.minTablet} {

  }
`

export const PageWrapper = styled.div`
  padding: 0 2rem;
  ${mediaQueries.minTablet} {
    display: grid;
    grid-gap: 0 60px;
    grid-template-columns: minmax(15rem, 27rem) 1fr ;
    padding: 0;
  }
  @media only screen and (min-width: 48em) and (max-width: 64em) {
    grid-gap: 0 30px;
    padding: 0 2rem;
  }
`

export const SinglePageWrapper = styled.div`
  width: 100%;
  max-width: 840px;
  margin: 0 auto;
`

export const SingleWrapper =styled.div`
  padding: 0 2rem;
`

export const SinglePageBody = styled.div`
  padding: 0 2rem;
  max-width: 768px;
  margin: 0 auto;
  ${mediaQueries.minTablet} {
    padding: 0;
  }
  ${mediaQueries.maxLaptop} {
    padding: 0 2rem;
  }
`

export const Mode = styled.div`
  display: none;
  ${mediaQueries.minTablet} {
    display: block;
  }
`

export const ModeDevice = styled.div`
  display: block;
  ${mediaQueries.minTablet} {
    display: none;
  }
`;
