import { useComputedColorScheme } from "@mantine/core";
import { ReactTerminal } from "react-terminal";
import React from "react";
import { compare } from "../../../utils/compare";

type PropType = {
  welcomeMessage?: JSX.Element,
  prompt: string
  defaultHandler?: (cmd: string, cmdArgs: string) => void
  enableInput: boolean,
}

function Terminal({ welcomeMessage, defaultHandler, enableInput, prompt }: PropType) {
  const computedColorScheme = useComputedColorScheme('light')

  return (
    <ReactTerminal
      prompt={prompt}
      theme={computedColorScheme === 'light' ? 'light' : 'dracula'}
      enableInput={enableInput}
      welcomeMessage={welcomeMessage}
      showControlButtons={false}
      showControlBar={true}
      defaultHandler={defaultHandler}
    />
  );
}

export default React.memo(Terminal, compare<PropType>)
