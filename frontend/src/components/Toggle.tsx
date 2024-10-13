import classes from "./Toggle.module.css"
import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from '@mantine/core'
import { IconMoon, IconSun } from '@tabler/icons-react'
import cx from 'clsx'

function Toggle() {
  const { setColorScheme } = useMantineColorScheme({
    keepTransitions: true
  })
  const computedColorScheme = useComputedColorScheme(
    'light',
    { getInitialValueInEffect: true }
  )
  return (
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
  )
}

export default Toggle
