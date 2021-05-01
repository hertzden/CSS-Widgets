import styled from 'styled-components'
import { Grid } from 'styled-icons/boxicons-regular'
import { JsSquare, Python } from 'styled-icons/fa-brands'
import { Html5 } from 'styled-icons/remix-line'
import {
  Atom,
  Brain,
  ChalkboardTeacher,
  Database,
  Robot,
} from 'styled-icons/fa-solid'
import { ToggleOn, ToggleOff} from 'styled-icons/material-outlined'
import { Cpu } from 'styled-icons/feather'
import { Lab, Sigma } from 'styled-icons/icomoon'
import { ColorLens, Web } from 'styled-icons/material'
import { WeatherSunny } from 'styled-icons/typicons'
import { mediaQueries } from 'utils/mediaQueries'
export { Tags as TagsIcon } from 'styled-icons/bootstrap'

export const TagGrid = styled.div`
  margin: 0;
  h2 {
    margin: 0 0 3rem 0;
    font-size: 2.4rem;
    font-weight: 600;
    text-transform: uppercase;
    padding-left: 3rem;
    position: relative;
    display: flex;
    &::before {
        display: block;
        background-color:#6272d0;
        content: "";
        border-radius: 9999px;
        position: absolute;
        height: 100%;
        width: 5px;
        top: 0px;
        left: 0px;
    }
  }
  ${mediaQueries.minTablet} {
    padding: 0;
    margin: 0 0 4rem 0;
  }
`


export const TagCloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  height: max-content;
  margin-bottom: ${props => (props.open ? `3rem` : 0)};
  ${mediaQueries.minTablet} {
    background: var(--color-boxBackground);
    border-radius: 1rem;
    box-shadow: 1px 1px 5px 0 rgb(1 1 1 / 5%);
    padding: 2rem;
    justify-content: flex-start;
    h2 {
      width: 100%;
      text-align: center;
    }
  }
`

export const Tag = styled.button`
  font-size: 1.4rem;
  padding: 0.6rem 1.2rem;
  margin: 0 10px 10px 0;
  display: flex;
  align-items: center;
  border: 0;
  cursor: pointer;
  width: max-content;
  white-space: nowrap;
  color: ${p => (p.active ? `var(--color-activeTagLink)` : `var(--color-link)`)};
  font-weight: 300;
  border-radius: 5px;
  border: 2px solid var(--color-background);
  background: transparent;
  &:hover {
    border-color: var(--color-tagsBorder);
  }
  ${mediaQueries.maxTablet} {
    border: 2px solid ${p => (p.active ? `var(--color-activeTagLink)` : `var(--color-link)`)};
    margin: 0 1em 1em 0;
    transition: all 0.6s ease 0s;
    visibility: ${props => (props.open ? `visible` : `hidden`)};
    margin-bottom: ${props => (props.open ? `1em` : `-2em`)};
    opacity: ${props => (props.open ? 1 : 0)};
  }
`

export const ToggleButton = styled.button`
  background: transparent;
  border: 0;
  padding: 0;
  margin: 0;
  ${mediaQueries.minTablet} {
    display: none;
  }
`

export const Toggle = styled(ToggleOff).attrs(props => ({
  as: props.open && ToggleOn,
  size: `4rem`,
}))`
  margin-left: 0.5em;
  cursor: pointer;
  color: var(--color-text);
  ${mediaQueries.minTablet} {
    display: none;
  }
`

export const tagIcons = {
  All: Grid,
  'Web Dev': Web,
  Tutorial: ChalkboardTeacher,
  'Machine Learning': Brain,
  'Data Science': Database,
  Sustainability: WeatherSunny,
  Science: Lab,
  Design: ColorLens,
  Technology: Cpu,
  Future: Robot,
  JS: Html5,
  Python,
  Statistics: Sigma,
}
