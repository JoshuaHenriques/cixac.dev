import { compare } from "../../../utils/compare";
import React, { useContext, useState } from "react";
import classes from './Repl.module.css'
import { TerminalContext } from "react-terminal";
import Terminal from "./Terminal";

const welcomeMessage = <>
  <span>Cixac Version: 0.5-beta(Oct 03 2024)</span><br />
  <span>Type "clear" to clear the terminal screen</span><br />
  <span>Use '\' at the end of a line for multi-line input</span><br />
</>

const SOCKET_URL = `wss://${window.location.hostname}/v1/ws`
const ws: WebSocket = new WebSocket(SOCKET_URL)

ws.addEventListener('open', () => {
  console.log("Websocket opened.")
})


function Repl() {
  const [prompt, setPrompt] = useState('>>')
  const { setBufferedContent } = useContext(TerminalContext)

  const defaultHandler = (cmd: string, cmdArgs: string) => {
    const code = `${cmd} ${cmdArgs}`
    if (code.trimEnd().slice(-1) == `\\`) {
      setPrompt(() => "...")
    } else {
      if (prompt != ">>") {
        setPrompt(() => ">>")
      }
    }
    ws.send(code)
    ws.onmessage = (event: any) => {
      setBufferedContent((prev) => (
        <>
          {prev}
          <span>{event.data.replaceAll(">> ", "")}</span>
          <br />
        </>
      ))
    }
  }

  return (
    <div className={classes.replTerminal}>
      <Terminal
        prompt={prompt}
        enableInput={true}
        welcomeMessage={welcomeMessage}
        defaultHandler={defaultHandler}
      />
    </div>
  )
}

export default React.memo(Repl, compare)
