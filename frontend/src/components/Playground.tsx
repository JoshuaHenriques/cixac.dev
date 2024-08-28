import { ChangeEvent, useContext, useState } from "react"
import Terminal from "./Terminal"
import { TerminalContext } from "react-terminal"
import { Button, Switch, Textarea } from "@mantine/core"
import { getWorker, useWorker } from "../worker/workerAPI"

type PropType = {

}

const wasmWorker = getWorker()

const SOCKET_URL = "ws://192.168.2.10:8080/v1/ws"
const ws = new WebSocket(SOCKET_URL)

ws.addEventListener('open', () => {
  console.log("Websocket opened.")
})

const theme = "dracula"
const welcomeMessage = <><span>Cixac Version: 0.1-alpha (Aug 20 2024)</span><br /></>
// const welcomeMessage = SOME THING FOR SCRIPT MODE

function Playground({ }: PropType) {
  const [replMode, setReplMode] = useState(true)
  const [textAreaValue, setTextAreaValue] = useState("")

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
    setReplMode((mode) => !mode)
  }

  const handleTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => setTextAreaValue(e.target.value)

  return (
    <>
      <Switch
        size="xl"
        onLabel="REPL"
        offLabel="SCRIPT"
        defaultChecked
        onChange={handleModeChange}
      />
      {replMode ?
        <Terminal
          prompt={'>>'}
          theme={theme}
          enableInput={true}
          welcomeMessage={welcomeMessage}
          defaultHandler={defaultHandler}
        /> :
        <>
          <Textarea
            resize="vertical"
            // placeholder="PUT SOME EXAMPLE CODE STUFF"
            value={textAreaValue}
            onChange={(event) => { handleTextArea(event) }}
          />
          <Terminal
            prompt={''}
            theme={theme}
            enableInput={false}
          />
          <Button variant="filled" onClick={handleRunCode} >Run Script</Button>
        </>
      }
    </>
  )
}

export default Playground
