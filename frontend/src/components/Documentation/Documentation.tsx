import { Button, Collapse } from '@mantine/core'
import { useDisclosure, useWindowScroll } from '@mantine/hooks'
import classes from './Documentation.module.css'
import Markdown from './Markdown'

function Documentation() {
  const [opened, { toggle }] = useDisclosure(false)
  const [scroll, scrollTo] = useWindowScroll()

  return (
    <div className={classes.docs}>
      <div className={classes.button} >
        <Button size="sm" onClick={() => {
          toggle()
          setTimeout(() => !opened && scrollTo({ y: scroll.y + 500 }), 400)
        }}>
          {opened ? <span>Close</span> : <span>Documentation</span>}
        </Button>
      </div>

      <Collapse in={opened} className={classes.collapse} transitionDuration={500} transitionTimingFunction="linear">
        <Markdown />
      </Collapse >
    </div >
  )
}

export default Documentation
