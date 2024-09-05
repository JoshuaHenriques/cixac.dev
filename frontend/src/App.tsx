import Playground from './components/Playground/Playground'
import Documentation from './components/Documentation/Documentation'
import Hero from './components/Hero/Hero'
import ToTop from './components/ToTop'
import { ActionIcon, Flex, Group, Stack, useComputedColorScheme, useMantineColorScheme } from '@mantine/core'
import { IconMoon, IconSun } from '@tabler/icons-react'
import cx from 'clsx'
import classes from './App.module.css'

function App() {
  const { setColorScheme } = useMantineColorScheme({
    keepTransitions: true
  })
  const computedColorScheme = useComputedColorScheme(
    'dark',
    { getInitialValueInEffect: true }
  )

  return (
    <>
      <div className={classes.toggle}>
        <ActionIcon
          onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
          variant="default"
          size="xl"
          aria-label="Toggle color scheme"
        >
          <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
          <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
        </ActionIcon>
      </div>
      <div className={classes.stack}>
        <Hero />
        <Playground />
        <Documentation />
      </div>
      <ToTop />
    </>
  )
}

export default App
