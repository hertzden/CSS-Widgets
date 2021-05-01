import { createGlobalStyle } from "styled-components";

// I'm using rgb numbers here for easily using rgba styling throughout the app
// You can put hexcodes, names, or any other definitions that fits the context of your app
const colorPalette = {
  lightShades: "242, 242, 241",
  lightAccent: "139, 142, 149",
  mainBrand: "140, 100, 88",
  darkAccent: "133, 129, 137",
  darkShades: "32, 30, 32",

  success: "95, 153, 81",
  warning: "221, 136, 25",
  error: "244, 67, 54",
};

const baseTheme = {
  actions: {
    error: colorPalette.error,
    info: colorPalette.darkShades,
    primary: colorPalette.mainBrand,
    success: colorPalette.success,
    warning: colorPalette.warning,
  },
  palette: {
    darkAccent: colorPalette.darkAccent,
    darkShades: colorPalette.darkShades,
    lightAccent: colorPalette.lightAccent,
    lightShades: colorPalette.lightShades,
    mainBrand: colorPalette.mainBrand,
  },
};

export const darkTheme = {
  ...baseTheme,
  global: {
    bg: colorPalette.darkShades,
    color: colorPalette.lightShades,
    link: colorPalette.mainBrand,
    linkHover: colorPalette.lightAccent,
  },
};

export const lightTheme = {
  ...baseTheme,
  global: {
    bg: colorPalette.lightShades,
    color: colorPalette.darkShades,
    link: colorPalette.mainBrand,
    linkHover: colorPalette.darkAccent,
  },
};

export const GlobalStyle = createGlobalStyle`
  html, body {
    height: 100%;
  }
  body {
    background-color: rgb(${(props) => props.theme.global.bg});
    color: rgb(${(props) => props.theme.global.color});

    transition: background 0.2s ease-out;
  }

  a {
    color: rgb(${(props) => props.theme.global.link});
  }

  a:hover {
    color: rgb(${(props) => props.theme.global.linkHover});
  }
`;
