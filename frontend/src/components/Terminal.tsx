import { ReactTerminal } from "react-terminal";

type PropTypes = {
  welcomeMessage?: JSX.Element,
  prompt: string
  defaultHandler?: (cmd: string, cmdArgs: string) => void
  theme: string,
  enableInput: boolean,
}

function Terminal({ welcomeMessage, theme, defaultHandler, enableInput, prompt }: PropTypes) {
  return (
    <ReactTerminal
      prompt={prompt}
      theme={theme}
      enableInput={enableInput}
      welcomeMessage={welcomeMessage}
      showControlButtons={false}
      defaultHandler={defaultHandler}
    />
  );
}

export default Terminal;
