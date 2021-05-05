import { PageComponents, Providers } from 'components/Global'
import "@fontsource/megrim"
import "@fontsource/baloo-2"
import "@fontsource/baloo-2/600.css"
import "@fontsource/baloo-2/700.css"
import React from 'react'


export const wrapRootElement = ({ element }) => {
  return <Providers>{element}</Providers>
}

export const wrapPageElement = ({ element, props }) => {
  return <PageComponents {...props}>{element}</PageComponents>
}
