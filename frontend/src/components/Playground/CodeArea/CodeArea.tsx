import { compare } from "../../../utils/compare"
import classes from "./CodeArea.module.css"
import React, { useContext, useEffect, useState } from "react"
import { TerminalContext } from "react-terminal"
import Repl from "./Repl"
import Script from "./Script"

type PropType = {
  scriptMode: boolean
}

function CodeArea({ scriptMode }: PropType) {
  const [bufferedContentStore, setBufferedContentStore] = useState<React.ReactNode>()
  const { setBufferedContent } = useContext(TerminalContext)

  // todo: refactor
  useEffect(() => {
    setBufferedContent((prev: React.ReactNode) => {
      const swap = bufferedContentStore
      setBufferedContentStore(prev)
      return swap
    })
  }, [scriptMode])


  return (
    <div className={classes.codeArea}>
      {scriptMode ? <Script /> : <Repl />}
    </div>
  )
}

export default React.memo(CodeArea, compare<PropType>)
