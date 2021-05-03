export const COLOR_MODE_KEY = `color-mode`

export const INITIAL_COLOR_MODE_CSS_PROP = `--initial-color-mode`

export const COLORS = {
  gray: {
    default: `#464849`,
    dark: `#3d3d3d`,
    darker: `#1a1d23`,
    darkest: `#060606`,
    light: `#bcbcbc`,
    lighter: `#e5e5e5`,
    lightest: `#f7f7f7`,
  },
  blue: {
    default: `#2202a9`,
    dark: `#150956`,
    darker: `#0a051e`,
    darkest: `#00040c`,
    light: `#1f59cd`,
    lighter: `#279AF1`,
  },
  orange: {
    default: `#ce4658`,
    dark: `#f86377`,
    darker: `#f86377`,
    darkest: `#b75500`,
  },
  green: {
    light: `#436467`,
    dark: `#729ea2`,
  },
}

const { gray, blue, orange, green} = COLORS

export const MODE_COLORS = {
  text: {
    // light: `#2d3748`,
    light: `#0a0c10`,
    dark: `#c7c7c7`,
    // dark: gray.lighter,
  },
  heading: {
    light: `#2d3748`,
    dark: gray.lighter,
  },
  outline: {
    light: `#2c0b8e`,
    dark: `#ecc54f`
  },
  bodyText: {
    light: `#0a0c10`,
    dark: `#a2a0a0`,
  },
  postHeading: {
    light: `#2c0b8e`,
    dark: `#ecc54f`,
  },
  background: {
    light: `#f8f8f8`,
    dark: `#0c1213`,
  },
  headerBackground: {
    light: `#fff`,
    dark: `#0e141b`,
  },
  boxBackground: {
    light: `#fff`,
    dark: `#131a23`,
  },
  boxTOCBackground: {
    light: `#ffe8eb`,
    dark: `#2f334e`,
  },
  tagsBackground: {
    light: `#ebf7f9`,
    dark: `#151d27`,
  },
  tagsBorder: {
    light: `blue.light`,
    dark: `#3d585d`,
  },
  hoverBackground: {
    light: `rgb(243 187 187 / 15%)`,
    dark: `rgb(35 51 68 / 70%)`,
  },
  shadow: {
    light: gray.lighter,
    dark: `black`,
  },
  link: {
    light: blue.light,
    dark: blue.lighter,
  },
  lightLink: {
    light: blue.lighter,
    dark: blue.lighter,
  },
  activeTagLink: {
    light: `#CE4658`,
    dark: `#ecc54f`,
  },
  accentBackground: {
    light: `rgba(0, 0, 0, 0.05)`,
    dark: `rgba(0, 0, 0, 0.7)`,
  },
  gray: {
    light: gray.regular,
    dark: gray.light,
  },
  green: {
    light: green.light,
    dark: green.dark,
  },
  lightGray: {
    light: gray.lightest,
    dark: gray.darker,
  },
  darkGray: {
    light: gray.default,
    dark: gray.darkest,
  },
  a: {
    light: orange.default,
    dark: orange.darker,
  },
  b: {
    light: blue.dark,
    dark: blue.darkest,
  },
  c: {
    light: blue.light,
    dark: blue.lighter,
  },
  d: {
    light: orange.darker,
    dark: orange.darkest,
  },
}

export const typography = {
  fonts: `"Titillium Web", Roboto, "Helvetica Neue", Arial, sans-serif`,
  // font sizes and line heights in em units
  minFontSize: 0.9,
  maxFontSize: 1.1,
  minLineHeight: 1.5,
  maxLineHeight: 1.8,
}
