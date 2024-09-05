import { Affix, Button, rem, Transition } from '@mantine/core'
import { IconArrowUp } from '@tabler/icons-react'
import { useWindowScroll } from '@mantine/hooks'

function ToTop() {
  const [scroll, scrollTo] = useWindowScroll()

  return (
    <Affix position={{ bottom: 20, right: 20 }}>
      <Transition transition="slide-up" mounted={scroll.y > 350}>
        {(transitionStyles) => (
          <Button
            leftSection={<IconArrowUp style={{ width: rem(16), height: rem(16) }} />}
            style={transitionStyles}
            onClick={() => scrollTo({ y: 0 })}
          >
            Scroll to top
          </Button>
        )}
      </Transition>
    </Affix>
  )
}

export default ToTop
