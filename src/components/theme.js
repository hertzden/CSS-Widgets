import React from 'react'
import { ThemeToggler } from 'gatsby-plugin-dark-mode'

class ThemeToggleComponent extends React.Component {
  render() {
    return (
      <ThemeToggler>
        {({ theme, toggleTheme }) => (
          <div className="py-1 md:p-1 relative checkbox-group mb-2 md:mb-0">
            <input
              type="checkbox"
              className="checkbox"
              id="checkbox-toggle"
              onChange={e => toggleTheme(e.target.checked ? 'dark' : 'light')}
              checked={theme === 'dark'}
            />
            <span className="checkbox-decorator">
            <svg width="18" height="18" viewBox="0 0 18 18" class="DarkModeToggle__MoonOrSun-sc-1ngd9fq-1 dBeOcn" style={{transform: 'rotate(90deg)'}}>
              <mask id="moon-mask-main-nav">
                <rect x="0" y="0" width="18" height="18" fill="#FFF"></rect>
                <circle cx="25" cy="0" r="8" fill="yellow"></circle>
              </mask>
              <circle cx="9" cy="9" fill="var(--color-toggle)" mask="url(#moon-mask-main-nav)" r="5"></circle>
              <g>
                <circle cx="17" cy="9" r="1.5" fill="var(--color-toggle)" style={{transformOrigin: 'center center', transform: 'scale(1)'}}></circle>
                <circle cx="13" cy="15.928203230275509" r="1.5" fill="var(--color-toggle)" style={{transformOrigin: 'center center', transform: 'scale(1)'}}></circle>
                <circle cx="5.000000000000002" cy="15.92820323027551" r="1.5" fill="var(--color-toggle)" style={{transformOrigin: 'center center', transform: 'scale(1)'}}></circle>
                <circle cx="1" cy="9.000000000000002" r="1.5" fill="var(--color-toggle)" style={{transformOrigin: 'center center', transform: 'scale(1)'}}></circle>
                <circle cx="4.9999999999999964" cy="2.071796769724492" r="1.5" fill="var(--color-toggle)" style={{transformOrigin: 'center center', transform: 'scale(1)'}}></circle>
                <circle cx="13" cy="2.0717967697244912" r="1.5" fill="var(--color-toggle)" style={{transformOrigin: 'center center', transform: 'scale(1)'}}></circle>
                </g>
            </svg>
            </span>
            <label for="checkbox-toggle" >
            Switch theme
          </label>
          </div>
        )}
      </ThemeToggler>
    )
  }
}


export default ThemeToggleComponent
