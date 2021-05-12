import { createGlobalStyle } from 'styled-components'
import { mediaQueries, screens } from 'utils/mediaQueries'
import { typography } from 'utils/constants'
import arrow from '../../images/circle-arrow.svg';



const { phone, desktop } = screens
const { fonts, minFontSize, maxFontSize, minLineHeight, maxLineHeight } = typography

export const GlobalStyle = createGlobalStyle`
html {
    // This defines what 1rem is
    font-size: 62.5%;
  }
  body {
    margin: 0;
    hyphens: auto;
    font: -apple-system;
    font-family: ${fonts};
    font-size: 1.8rem;
    line-height: 2.8rem;
    /* Fix very large font size in code blocks in iOS Safari (https://stackoverflow.com/a/3428477). */
    -webkit-text-size-adjust: 100%;
    &.banner.open {
        overflow: hidden;
    }
    /* Ensure full-height page even if insufficient content. */
    #gatsby-focus-wrapper {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    /* The rules below enable dark mode. */
    background: var(--color-background);
    color: var(--color-text);
    a {
      text-decoration: none;
      color: var(--color-link);
      :hover {
        color: var(--color-a);
      }
    }
  }
  a.skip-main {
      left: -999px;
      position: absolute;
      top: auto;
      width: 1px;
      height: 1px;
      overflow: hidden;
      z-index: -999;
  }

  a.skip-main:active, a.skip-main:focus {
      color: #d33a2c;
      background-color: #fff;
      left: 10px;
      top: 10px;
      width: auto;
      height: auto;
      overflow: auto;
      padding: .5em 1em;
      text-align: center;
      font-size: 1.2em;
      z-index: 999;
  }
  h1, h2, h3, h4, h5, h6 {
    line-height: initial;
    letter-spacing: 1px;
    color: var(--color-heading);
  }

  h1 {
    font-weight: 600;
  }
  h2 {
    font-weight : 600;
  }
  h3, h4, h5, h6 {
    font-weight : 500;
  }
  p {
    margin: 0 0 2rem 0;
    -webkit-font-smoothing: antialiased;
  }

  strong {
    font-weight: 600;
  }
  iframe {
    margin: 3rem 0;
    border: 2px solid rgb(21, 21, 21) !important;
  }
  ::selection {
    color: var(--color-textHighlight);
    background: var(--color-outline);
  }
  blockquote, details {
    border-left: 0.25em solid var(--color-link);
    background: var(--color-blockquoteBG);
    padding: 0.1em 0.3em 0.1em 1em;
    margin: 3rem 0 4rem 0;
    summary {
      font-weight: 600;
    }
    p {
      margin: 2rem 0;
    }
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    white-space: nowrap;
    border-width: 0;
}
.anchor.before {
  transform: translateX(-125%);
  padding: 0;
}
  table {
    border-collapse: collapse;
    width: 100%;
  }
  table td, table th {
    border: 1px solid var(--color-text);
    padding: 0.2em 0.6em;
  }
  tbody tr:nth-child(odd) {
    background: var(--color-accentBackground);
  }
  .wrapper {
    max-width: 1140px;
    width: 100%;
    margin: 0 auto;
  }
  .inner-wrapper {
    padding: 0 2rem;
    ${mediaQueries.minTablet} {
      padding: 0;
    }
  }
  .logo {
    height: 60px;
    width: 60px;
    ${mediaQueries.minTablet} {
      height: 80px;
      width: 80px;
    }
  }
  .hero-bg {
    fill: var(--color-background);
    height: 30px;
    ${mediaQueries.minTablet} {
      height: 60px;
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    :focus {
      outline: 2px solid var(--color-outline);
      outline-offset: 2px;
      outline-style: dashed;
    }
  }

  @media (prefers-reduced-motion: no-preference) {
  :focus-visible {
    transition: outline-offset .25s ease;
    outline-offset: 2px;
    outline: 2px solid var(--color-outline);
    outline-style: dashed;
    }
  }

  :focus:not(:focus-visible) {
    outline: 0;
  }


  .sidebar {
    display: flex;
  }
  .sidebar-wrap {
    position: static;
    width: 100%;
    ${mediaQueries.minLaptop} {
      position: fixed;
      width: 320px;
    }
  }
  .single-article {
    max-width: 780px;
    // background: var(--color-boxBackground);
    // box-shadow: 1px 1px 5px 0 rgb(1 1 1 / 5%);
    // padding: 2rem 4rem;
    // border-radius: 10px;
    transition: transform 250ms ease,box-shadow 250ms ease,color 250ms ease;
    margin: 0 0 3rem 0;
    //letter-spacing: 1px;
    line-height: 3.6rem;
    color: var(--color-articleText);
    ${mediaQueries.maxLaptop} {
      max-width: 680px;
    }
    h2, h3, h4, h5, h6 {
      color: var(--color-postHeading);
      margin: 1rem 0;
      svg {
        fill: var(--color-postHeading);
      }
    }
    h2 {
      font-size: 2.6rem;
      line-height: 3.6rem;
      ${mediaQueries.minTablet} {
        font-size: 3rem;
        line-height: 4rem;
      }
    }
    h3 {
      font-size: 2.2rem;
      line-height: 3rem;
      font-weight: 500;
    }
    ul {
      list-style: none;
      padding-left: 10px;
    }
    ul li {
      display: flex;
      align-items: center;
    }
    ul li:before {
      content: '';
      position: relative;
      color: #0099cc;
      background: url(${arrow}) no-repeat center;
      background-size: 16px;
      width: 16px;
      height: 16px;
      padding-left: 24px;
      //filter: brightness(var(--color-filter));
    }
  }
  .gatsby-code-title {
    background: #ecc54f;
  }
  [class*="elements__"], [class^="elements__"] {
    background: #17242f !important;
  }
  div.scroll {
    overflow: scroll;
    margin: 1em auto;
    border: 1px solid var(--color-text);
    border-width: 0 1px;
    white-space: nowrap;
    table td, table th {
      :first-child {
        border-left: none;
      }
      :last-child {
        border-right: none;
      }
    }
  }
`
