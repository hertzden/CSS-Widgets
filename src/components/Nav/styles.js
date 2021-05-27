import styled from 'styled-components'
import { Menu3 } from 'styled-icons/remix-line'
import { Close as Cross } from 'styled-icons/material'
import { mediaQueries } from 'utils/mediaQueries'
import { Link } from 'gatsby'


// Unable to accommodate expanding search box via overflow-x: scroll;
// here because of https://stackoverflow.com/a/6433475. Would include
// potential future SubNavs in vertical scrolling, effectively hiding them.



export const NavDiv = styled.nav`
  align-items: center;
  /* transition: 0.3s; */
  color: var(--color-heading);
  button {
    position: absolute;
    top: 35px;
    right: 20px;
  }
  ul {
    list-style-type: none;
    padding: 0;
    margin-top: 100px;
    display: grid;
    grid-gap: 30px;
    flex-flow: column;
    justify-content: center;
    justify-items: center;
    align-items: center;
    ${mediaQueries.minTablet} {
      margin: 0;
      display: grid;
      grid-gap: 15px;
      grid-auto-flow: column;
    }
    li {
      /* margin-bottom: 20px; */
      ${mediaQueries.minTablet} {
        margin: 0;
      }
    }
    li a {
      font-size: 2.4rem;
      padding: 0.7rem 1rem;
      position: relative;
      &:hover {
        /* background-color: var(--color-hoverBackground);
        border-radius: 10px; */
      }
      ${mediaQueries.minTablet} {
        font-size: 1.8rem;
      }
    }
  }

  /* Desktop */
  ${mediaQueries.minTablet} {
    /* grid-auto-flow: column;
    justify-self: start; */
  }
  /* Mobile */
  ${mediaQueries.maxTablet} {
    box-sizing: border-box;
    background: var(--color-background);
    overscroll-behavior: none;
    z-index: 2;
    transform: translate(${props => (props.open ? `100%` : `0`)});
    grid-auto-rows: max-content;
    justify-content: center;
    width: 100vw;
    position: fixed;
    top: 0;
    height: 100%;
    right: 100%;
    /* Needed to scroll past last element in case of overflow. */
    :after {
      content: '';
      height: 0.5em;
    }
  }
`

export const ToggleButton = styled.button`
  border: 0;
  background: transparent;
  color: var(--color-text);
  display: block;
  padding: 0;
  ${mediaQueries.minTablet} {
    display: none;
  }
`

export const NavToggle = styled(Cross).attrs(props => ({
  as: props.opener && Menu3,
  size: props.opener ? `3rem` : `3rem`,
}))`
  transition: 0.3s;
  cursor: pointer;
  :hover {
    transform: scale(1.05);
  }
  ${p =>
    !p.opener &&
    `position: static;`}
  ${mediaQueries.minTablet} {
    display: none;
  }
`

export const NavLink = styled(Link).attrs({
  activeClassName: `active`,
  partiallyActive: true,
})`
  white-space: nowrap;
  color: inherit;
  transition: 0.3s;
  &:before {
    content: "";
    width: 0;
    height: 4px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f86377;
    border-radius: 9999px;
    transform: rotate( 2deg);
    transition: all .3s ease-in-out;
  }
  &.active {
    color: var(--color-a);
    &:before {
      position: absolute;
      bottom: -3px;
      left: 0;
      content: "";
      width: 100%;
      height: 4px;
      background: #f86377;
      border-radius: 9999px;
      transform: rotate( 2deg);
    }
  }
  :hover {
    color: var(--color-a);
    transition: all .3s ease-in-out;
  }
  :hover:before {
    width: 100%;
    left: 0;
  }
`
