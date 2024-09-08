import Markdown from 'react-markdown'
import { Button, Collapse } from '@mantine/core'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import cixacDocs from '../../assets/cixacDocs.md?raw'
import { useDisclosure, useWindowScroll } from '@mantine/hooks'
import classes from './Documentation.module.css'

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

      <Collapse in={opened} transitionDuration={500} transitionTimingFunction="linear">
        <Markdown
          className={classes.markdown}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug]}
        >
          {cixacDocs}
        </Markdown>
      </Collapse >
    </div >
  )
}

export default Documentation
