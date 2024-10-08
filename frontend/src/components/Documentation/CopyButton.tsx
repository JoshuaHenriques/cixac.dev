import { useState } from "react"
import classes from "./CopyButton.module.css"

function CopyButton({ codeElement }: { codeElement: HTMLElement }) {
  const [fillColor, setFillColor] = useState('')

  const handleOnClick = () => {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = codeElement.textContent || "";
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
    setFillColor('#8BC34A')
    setTimeout(() => {
      setFillColor('')
    }, 2000)
  }


  return (
    <button onClick={handleOnClick} className={classes.button}>
      <svg
        viewBox="0 0 384 512"
        width="16"
        height="16"
        fill={fillColor}
      >
        <path d="M280 240H168c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h112c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8zm0 96H168c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h112c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8zM112 232c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24zM336 64h-80c0-35.3-28.7-64-64-64s-64 28.7-64 64H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zM192 48c8.8 0 16 7.2 16 16s-7.2 16-16 16-16-7.2-16-16 7.2-16 16-16zm144 408c0 4.4-3.6 8-8 8H56c-4.4 0-8-3.6-8-8V120c0-4.4 3.6-8 8-8h40v32c0 8.8 7.2 16 16 16h160c8.8 0 16-7.2 16-16v-32h40c4.4 0 8 3.6 8 8v336z"></path>
      </svg>
    </button >
  )
}

export default CopyButton
