import Markdown from 'react-markdown'
import { Box, Button, Collapse, Group } from '@mantine/core'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import cixacDocs from '../assets/cixacDocs.md?raw'
import { useDisclosure } from '@mantine/hooks'

function Documentation() {
  const [opened, { toggle }] = useDisclosure(false)

  return (
    <Box>
      <Group justify="center" mb={5}>
        <Button onClick={toggle}>Show Documentation</Button>
      </Group>

      <Collapse in={opened} transitionDuration={500} transitionTimingFunction="linear">
        <h1>Documentation</h1>
        <Markdown
          className={"markdown"}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug]}
        >
          {cixacDocs}
        </Markdown>
      </Collapse>
    </Box>
  )
}

export default Documentation
