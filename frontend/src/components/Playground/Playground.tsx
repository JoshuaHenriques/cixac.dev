import { useState } from "react"
import { TerminalContextProvider } from 'react-terminal'
import { Switch } from "@mantine/core"
import classes from './Playground.module.css'
import CodeArea from "./CodeArea/CodeArea"


function Playground() {
  const [scriptMode, setScriptMode] = useState(true)

  return (
    <div className={classes.playground}>
      <Switch
        size="xl"
        onLabel="SCRIPT"
        offLabel="REPL"
        defaultChecked
        className={classes.switch}
        onChange={() => setScriptMode((mode) => !mode)}
      />
      <TerminalContextProvider>
        <CodeArea scriptMode={scriptMode} />
      </TerminalContextProvider>
    </div>
  )
}

export default Playground
