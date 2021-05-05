import { createGlobalStyle } from 'styled-components'

const langTagColor = [
  { lang: `javascript`, tag: `js`, color: `#f7df1e` },
  { lang: `js`, tag: `js`, color: `#f7df1e` },
  { lang: `jsx`, tag: `jsx`, color: `#61dafb` },
  { lang: `env`, tag: `env`, color: `#ff89d3` },
  { lang: `python`, tag: `py`, color: `#61da84` },
  { lang: `py`, tag: `py`, color: `#61da84` },
  { lang: `graphql`, tag: `graphql`, color: `#e10098` },
  { lang: `gql`, tag: `graphql`, color: `#e10098` },
  { lang: `html`, tag: `html`, color: `#005a9c` },
  { lang: `css`, tag: `css`, color: `#ff9800` },
  { lang: `shell`, tag: `shell`, color: `white` },
  { lang: `sh`, tag: `sh`, color: `white` },
  { lang: `bash`, tag: `bash`, color: `white` },
  { lang: `yml`, tag: `yaml`, color: `linen` },
  { lang: `yaml`, tag: `yaml`, color: `linen` },
  { lang: `markdown`, tag: `md`, color: `#e6ffed` },
  { lang: `md`, tag: `md`, color: `#e6ffed` },
  { lang: `mdx`, tag: `mdx`, color: `#55d179` },
  { lang: `json`, tag: `json`, color: `#fff` },
  { lang: `diff`, tag: `diff`, color: `#e8bd36` },
  { lang: `text`, tag: `text`, color: `gray` },
]

const languageTags = langTagColor.map(
  ({ lang, tag, color }) =>
    `pre.grvsc-container[data-language="${lang}"]::before {
        content: '${tag}';
        background: #17242f;
      }`
)

export default createGlobalStyle`
  ${languageTags.join(`\n`)}

  pre.grvsc-container {
    position: relative;
    background: #17242f;
    border-radius: 0.5em;
    line-height: 1.5em;
    margin: 5rem 0 3rem 0;
    padding: 3rem 0;
    overflow: visible;
  }

  pre.grvsc-container[data-language]::before {
    position: absolute;
    top: -35px;
    right: 2em;
    padding: 5px 10px;
    font-size: 2rem;
    font-weight: 400;
    line-height: initial;
    text-transform: uppercase;
    border-radius: 5px 5px 0px 0px;
    font-family: 'Baloo 2';
    color: #ecc54f;
  }

  .gatsby-code-title {
    background: var(--color-orange-default);
    color: black;
    padding: 0.3em 0.5em;
    width: max-content;
    margin: 1em 0 -1.6em 1em;
    border-radius: 0.3em;
    position: relative;
    top: 2.3rem;
    z-index: 1;
    font-size: 0.8em;
    line-height: initial;
  }

  /* highlighted lines */
  :root {
    --grvsc-line-highlighted-background-color: rgba(255, 255, 255, 0.2); /* default unchanged */
    --grvsc-line-highlighted-border-color: var(--color-blue-lighter); /* default: rgba(255, 255, 255, 0.5) */
    --grvsc-line-highlighted-border-width: 0.3em; /* default: 2px */
  }

  /* inline code */
  :not(pre) > code {
    border-radius: 0.2em;
    background: var(--color-accentBackground);
    padding: 0.15em 0.2em;
    font-size: 1.1em;
  }
`
