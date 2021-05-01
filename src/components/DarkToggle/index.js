import React from 'react'
import { useTransition } from 'react-spring'
import { useDarkMode } from 'hooks'
import { Box, Div, Icons, Notification, ModeToggleButton } from './styles'

const modes = {
  light: [`Light Mode`, Icons.Sun, `dark`],
  dark: [`Dark Mode`, Icons.Moon, `auto`],
  auto: [`Auto Mode`, Icons.SunMoon, `light`],
}

export default function DarkToggle({ size = `1em`, ...rest }) {
  const [colorMode, setColorMode] = useDarkMode()
  if (colorMode && ![`light`, `dark`, `auto`].includes(colorMode))
    console.error(`Invalid color mode: ${colorMode}`)

  const transitions = useTransition(colorMode, null, {
    initial: null,
    from: { opacity: 0, transform: `translateY(100%)` },
    enter: { opacity: 1, transform: `translateY(0%)` },
    leave: { opacity: 0, transform: `translateY(-100%)` },
  })

  return (
    <Box {...rest}>
      {transitions.map(({ item, props: style, key }) => {
        // Since we can't know the value of media queries or localStorage during SSR,
        // defer any rendering of the toggle until after rehydration on the client.
        if (!item) return null
        const [title, Icon, nextMode] = modes[item]
        return (
          <ModeToggleButton>
            <Div key={key}>
              <Div style={style}>
                <Icon size={size} title={title} onClick={() => setColorMode(nextMode)} />
              </Div>
              <Div style={style}>
                <Notification >{title}</Notification>
              </Div>
            </Div>
          </ModeToggleButton>
        )
      })}
    </Box>
  )
}
