import { PageComponents, Providers } from 'components/Global'
import "@fontsource/Megrim"
import "@fontsource/titillium-web"
import "@fontsource/titillium-web/600.css"
import "@fontsource/titillium-web/700.css"
import React from 'react'

export const wrapRootElement = ({ element }) => {
  return <Providers>{element}</Providers>
}

export const wrapPageElement = ({ element, props }) => {
  return <PageComponents {...props}>{element}</PageComponents>
}
