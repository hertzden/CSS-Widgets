import { PageComponents, Providers } from 'components/Global'
import "@fontsource/baloo-2"
import "@fontsource/baloo-2/500.css"
import "@fontsource/baloo-2/600.css"
import "@fontsource/baloo-2/700.css"
import "@fontsource/titillium-web"
import "@fontsource/titillium-web/700.css"
import "@fontsource/fira-code"
import React from 'react'


export const wrapRootElement = ({ element }) => {
  return <Providers>{element}</Providers>
}

export const wrapPageElement = ({ element, props }) => {
  return <PageComponents {...props}>{element}</PageComponents>
}
