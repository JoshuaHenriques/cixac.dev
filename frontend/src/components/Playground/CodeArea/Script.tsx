import { Button } from '@mantine/core'
import React, { ChangeEvent, useContext, useState } from 'react'
import { getWorker, useWorker } from "../../../worker/workerAPI"
import classes from './Script.module.css'
import { compare } from '../../../utils/compare'
import TextArea from './TextArea'
import { TerminalContext } from 'react-terminal'
import Terminal from './Terminal'

const wasmWorker = getWorker()

function Script() {
  const { setBufferedContent } = useContext(TerminalContext)
  const [textAreaValue, setTextAreaValue] = useState(`for (let i = 0; i < 100; i++) {
  if (i % 2 == 0) {
    continue
  }

  print(i)
}
`)

  const handleTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => setTextAreaValue(e.target.value)

  const handleRunCode = () => {
    useWorker(wasmWorker, textAreaValue, (data: any) => {
      setBufferedContent((prev: any) => (
        <>
          {prev && <>{prev}<br /></>}<span>{data}</span>
        </>
      ))
    })
  }


  return (
    <div className={classes.script}>
      <div className={classes.textAndTerm}>
        <TextArea value={textAreaValue} handleTextArea={handleTextArea} />
        <div className={classes.scriptTerminal}>
          <Terminal
            prompt={''}
            enableInput={false}
          />
        </div>
      </div>
      <Button size="sm" className={classes.runScriptBtn} onClick={handleRunCode}>Run</Button>
    </div>
  )
}

export default React.memo(Script, compare)
