import { graphql, useStaticQuery } from 'gatsby'
import { useOnClickOutside } from 'hooks'
import React, { useRef, useState, useEffect } from 'react'
import { NavDiv, NavLink, NavToggle, ToggleButton } from './styles'
import { globalHistory } from '@reach/router'
import Helmet from 'react-helmet'

export default function Nav(props) {
  const { nav } = useStaticQuery(graphql`
    {
      nav: allNavYaml {
        nodes {
          title
          url
        }
      }
    }
  `)
  const ref = useRef()
  const [open, setOpen] = useState(false)
  useOnClickOutside(ref, () => open && setOpen(false))
  // close mobile nav on route changes, would remain open because part of wrapPageElement
  useEffect(() => globalHistory.listen(() => setOpen(false)), [])
  return (
    <>
      <ToggleButton><NavToggle opener open={open} onClick={() => setOpen(true)} /></ToggleButton>
      <Helmet>
        <body className={`banner ${open ? "open" : ""}`} />
      </Helmet>
      <NavDiv ref={ref} open={open} onScroll={e => e.preventDefault()} {...props}>
        <ToggleButton aria-expanded={`${open ? "true": "false"}`}><NavToggle open={open} onClick={() => setOpen(false)} /></ToggleButton>
        <ul>
        {nav.nodes.map(({ title, url }) => (
          <li><NavLink key={url} to={url}>
            {title}
          </NavLink></li>
        ))}</ul>
      </NavDiv>
    </>
  )
}
