import { useStyledDarkMode } from "gatsby-styled-components-dark-mode";
import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { GlobalStyle } from "./theme";

const MainHeading = styled.h2`
  color: rgb(${(props) => props.theme.palette.mainBrand});
`;

export const Layout = (props) => {
  const theme = useContext(ThemeContext);
  const { isDark, toggleDark } = useStyledDarkMode();

  return (
    <div>
      <GlobalStyle theme={theme} />
      <header>
        <MainHeading>
          <a href={"#"}>Gatsby Dark Theme</a>
        </MainHeading>
        <div>
          <label>
            <input
              type="checkbox"
              onChange={() => toggleDark()}
              checked={!!isDark}
            />{" "}
            Dark mode
          </label>
        </div>
      </header>
      <main>{props.children}</main>
    </div>
  );
};
