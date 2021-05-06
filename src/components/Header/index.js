import React, { useEffect, useRef, useState } from 'react'
import DarkToggle from '../DarkToggle'
import Nav from '../Nav'
import { HeaderDiv, HeaderDivInner, Logo, Title, Hero, Mode, ModeDevice } from './styles'
import logo from '../../images/logo.svg';


const searchIndices = [
  { name: `Pages`, title: `Pages` },
  { name: `Posts`, title: `Blog Posts`, type: `postHit` },
]



export default function Header({ site, title }) {
useEffect(() => {
  const gatsbyFocusWrapper =
   document.getElementById('gatsby-focus-wrapper')
   if (gatsbyFocusWrapper) {
      gatsbyFocusWrapper.removeAttribute('style');
      gatsbyFocusWrapper.removeAttribute('tabIndex');
     }
   },
  [])
  return (
    <>
    <HeaderDiv>
      <HeaderDivInner>
        {/*<Logo to="/" title={site.title} rel="home">
          <img src="/logo.svg" alt="CSS Widgets Logo" height="80" width="80" /> <Title>CSS Widgets</Title>
        </Logo>*/}
        <Logo to="/" title={site.title} rel="home">
          <img src={logo} alt="CSS Widgets Logo" className="logo" /><Title />
        </Logo>
        <ModeDevice>
          <DarkToggle />
        </ModeDevice>
        <Nav />

        {/*<Search indices={searchIndices} />*/}

        <Mode>
          <DarkToggle />
        </Mode>
      </HeaderDivInner>
      <Hero>
        <svg preserveAspectRatio="none" width="100%" height="74" viewBox="0 0 1440 74" class="hero-bg">
          <path d="M456.464 0.0433865C277.158 -1.70575 0 50.0141 0 50.0141V74H1440V50.0141C1440 50.0141 1320.4 31.1925 1243.09 27.0276C1099.33 19.2816 1019.08 53.1981 875.138 50.0141C710.527 46.3727 621.108 1.64949 456.464 0.0433865Z">
          </path>
        </svg>
      </Hero>
    </HeaderDiv>

    </>
  )
}
