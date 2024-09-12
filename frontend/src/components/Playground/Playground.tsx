import { ChangeEvent, useContext, useState } from "react"
import Terminal from "../Terminal"
import { TerminalContext } from "react-terminal"
import { Button, Switch } from "@mantine/core"
import { getWorker, useWorker } from "../../worker/workerAPI"
import classes from './Playground.module.css'
import TextArea from "./TextArea"

const wasmWorker = getWorker()

const SOCKET_URL = "ws://192.168.2.10:8080/v1/ws"
const ws = new WebSocket(SOCKET_URL)

ws.addEventListener('open', () => {
  console.log("Websocket opened.")
})

const welcomeMessage = <><span>Cixac Version: 0.1-alpha (Aug 20 2024)</span><br /><span>Type "clear" to clear the terminal screen</span><br /></>

function Playground() {
  const [scriptMode, setScriptMode] = useState(true)
  const [textAreaValue, setTextAreaValue] = useState(`for (let i = 0; i < 100; i++) {
  if (i % 2 == 0) {
    continue
  }

  print(i)
}
`)

  const { setBufferedContent } = useContext(TerminalContext)
  const [bufferedContentStore, setBufferedContentStore] = useState<React.ReactNode>()

  const defaultHandler = (cmd: string, cmdArgs: string) => {
    const code = `${cmd} ${cmdArgs}`
    ws.send(code)
    ws.onmessage = (event) => {
      setBufferedContent((prev) => (
        <>
          {prev}
          <span>{event.data.replaceAll(">> ", "")}</span>
          <br />
        </>
      ))
    }
  }

  const handleRunCode = () => {
    useWorker(wasmWorker, textAreaValue, (data: any) => {
      setBufferedContent((prev) => (
        <>
          {prev && <>{prev}<br /></>}<span>{data}</span>
        </>
      ))
    })
  }

  const handleModeChange = () => {
    setBufferedContent((prev: React.ReactNode) => {
      const swap = bufferedContentStore
      setBufferedContentStore(prev)
      return swap
    })
    setScriptMode((mode) => !mode)
  }

  const handleTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => setTextAreaValue(e.target.value)

  return (
    <div className={classes.playground}>
      <div className={classes.switch}>
        <Switch
          size="xl"
          onLabel="SCRIPT"
          offLabel="REPL"
          defaultChecked
          onChange={handleModeChange}
        />
      </div>
      <div className={classes.codeArea}>
        {!scriptMode ?
          <div className={classes.replTerminal}>
            <Terminal
              prompt={'>>'}
              enableInput={true}
              welcomeMessage={welcomeMessage}
              defaultHandler={defaultHandler}
            />
          </div> :
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
        }
      </div>
    </div>
  )
}

export default Playground
