import { useEffect } from "react";
import { createRoot, Root } from "react-dom/client";
import CopyButton from "./CopyButton";
import MD from 'react-markdown'
import classes from './Markdown.module.css'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import cixacDocs from '../../assets/cixacDocs.md?raw'

function Markdown() {
  useEffect(() => {
    const codeElements = document.querySelectorAll('code:not(table code)');
    const roots: any = []

    codeElements.forEach(function (codeElement: any) {
      let parentElement: any = codeElement.parentElement;
      if (parentElement.tagName.toLowerCase() === 'pre') {
        parentElement.style.position = 'relative';
      } else {
        codeElement.style.position = 'relative';
      }
      const buttonContainer = document.createElement('div')
      buttonContainer.className = 'copy-button-container'

      if (parentElement?.tagName?.toLowerCase() === 'pre') {
        parentElement?.appendChild(buttonContainer);
      } else {
        codeElement?.appendChild(buttonContainer);
      }

      const root = createRoot(buttonContainer)
      root.render(<CopyButton codeElement={codeElement} />)
      roots.push(root)
    });

    return () => {
      roots.forEach((root: Root) => root.unmount())
      document.querySelectorAll('.copy-button-container').forEach(container => container.remove())
    }
  }, [])

  return (
    <MD
      className={classes.markdown}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug]}
    >
      {cixacDocs}
    </MD>
  )
}

export default Markdown
