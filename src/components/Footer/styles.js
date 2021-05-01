import styled from 'styled-components'
import { Link } from 'gatsby'
import { mediaQueries } from 'utils/mediaQueries'
import { Gatsby, Github, Netlify } from 'styled-icons/simple-icons'
import { Copyright } from 'styled-icons/boxicons-regular'

export const FooterDiv = styled.footer`
  background: transparent;
  padding: 2rem;
  color: var(--color-text);
  a {
    color: var(--color-text);
  }
  ${mediaQueries.minTablet} {
    padding: 3rem;
  }
`



export const FooterWrap = styled.div`
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  flex-flow: column;
  font-size: 1.4rem;
  ${mediaQueries.minTablet} {
    display: flex;
    flex-flow: row;
    align-items: flex-end;
  }
  .copyright {
    display: flex;
    align-items: center;
    svg {
      margin-top: 1px;
    }
  }
`

export const PoweredBy = styled.div`
  grid-area: poweredBy;
  > a {
    padding: 0 0.5em;
  }
`

export const Icons = {
  Gatsby,
  Github,
  Netlify,
  Copyright
}
