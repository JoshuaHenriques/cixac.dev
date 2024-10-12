import { Box, Button, Title, useComputedColorScheme } from '@mantine/core'
import GitHubButton from 'react-github-btn'
import classes from './Hero.module.css'

function Hero() {
  const computedColorScheme = useComputedColorScheme(
    'light',
    { getInitialValueInEffect: true }
  )

  return (
    <Box className={classes.hero}>
      <Title order={1} className={classes.title}>
        <span>The Cixac Programming Language</span>
      </Title >
      <Button className={classes.button}>
        <GitHubButton
          href="https://github.com/joshuahenriques/cixac"
          data-color-scheme={`${computedColorScheme === 'light' ? 'light' : 'dark'}`}
          data-size="large"
          aria-label="Star joshuahenriques/cixac on GitHub"
        >
          Star
        </GitHubButton>
      </Button>
    </Box>
  )
}

export default Hero
