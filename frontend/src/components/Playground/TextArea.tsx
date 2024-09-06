import { ChangeEvent, useRef, useEffect } from "react"
import classes from "./TextArea.module.css"

type PropTypes = {
  handleTextArea: (event: ChangeEvent<HTMLTextAreaElement>) => void
  value: string
}

function TextArea({ handleTextArea, value }: PropTypes) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === 'Tab') {
        e.preventDefault()
        const textarea = e.target
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const spaces = "  "

        textarea.value = textarea.value.substring(0, start) + spaces + textarea.value.substring(end)
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length
      }
    }

    const textareaElement = textareaRef.current
    if (textareaElement) {
      textareaElement.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      if (textareaElement) {
        textareaElement.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [])

  return (
    <textarea
      autoFocus
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      ref={textareaRef}
      value={value}
      onChange={(event) => { handleTextArea(event) }}
      className={classes.textarea}
      wrap="soft"
    />
  )
}

export default TextArea;
