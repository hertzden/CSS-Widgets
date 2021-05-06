import { Link } from 'gatsby'
import { typography } from 'utils/constants'
import styled from 'styled-components'
import { mediaQueries } from 'utils/mediaQueries'
import logoText from '../../images/logo-text.svg';

const { logoFont } = typography

export const Title = styled.div`
  background-image: url(${logoText});
  background-size: contain;
  background-repeat: no-repeat;
    width: 150px;
    height: 62px;
    background-position: center center;
    filter: brightness(var(--color-filter));
    ${mediaQueries.minTablet} {
      width: 200px;
      height: 82px;
      background-position: -10px;
    }
`

export const HeaderDiv = styled.header`
  height: 105px;
  position: sticky;
  top: 0;
  padding: 2rem 2rem 0;
  z-index: 3;
  color: white;
  font-size: 1.6rem;
{/*border-bottom: 1px solid var(--color-a);*/}
  background: var(--color-headerBackground);
  ${mediaQueries.minTablet} {
    height: 155px;
    padding: 2rem 2rem 0;
  }
`

export const HeaderDivInner = styled.div`
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  display: grid;
  grid-gap: 0 25px;
  grid-template-columns: 1fr auto auto;
  justify-content: space-between;
  align-items: center;
  ${mediaQueries.minTablet} {
    grid-template-columns: 1fr auto auto;
  }
`

export const Logo = styled(Link)`
font-size: 2.4em;
transform: scale(1);
color: inherit;
place-self: flex-start;
display: flex;
flex-basis: 33.33%;
`
// export const Title = styled.div`
//   font-size: 3rem;
//   line-height: 3.2rem;
//   font-family: ${logoFont};
//   font-weight: 600;
//   text-transform: uppercase;
//   align-self: flex-end;
//   padding-left: 10px;
//   max-width: 132px;
//   color: var(--color-text);
//   ${mediaQueries.minTablet} {
//     font-size: 3.6rem;
//     line-height: 4rem;
//     max-width: 150px;
//   }
// `

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
`

export const Hero = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: -10px;
`;
