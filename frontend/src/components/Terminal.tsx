import { useComputedColorScheme } from "@mantine/core";
import { ReactTerminal } from "react-terminal";

type PropTypes = {
  welcomeMessage?: JSX.Element,
  prompt: string
  defaultHandler?: (cmd: string, cmdArgs: string) => void
  enableInput: boolean,
}

function Terminal({ welcomeMessage, defaultHandler, enableInput, prompt }: PropTypes) {
  const computedColorScheme = useComputedColorScheme(
    'light',
    { getInitialValueInEffect: true }
  )
  return (
    <ReactTerminal
      prompt={prompt}
      theme={`${computedColorScheme === 'light' ? 'light' : 'dracula'}`}
      enableInput={enableInput}
      welcomeMessage={welcomeMessage}
      showControlButtons={false}
      showControlBar={true}
      defaultHandler={defaultHandler}
    />
  );
}

export default Terminal;
