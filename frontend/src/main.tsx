import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TerminalContextProvider } from 'react-terminal'
import App from './App.tsx'
import './index.css'
import '@mantine/core/styles.css'
import { createTheme, MantineProvider } from '@mantine/core'

const theme = createTheme({
  /** Put your mantine theme override here */
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TerminalContextProvider>
      <MantineProvider theme={theme}>
        <App />
      </MantineProvider>
    </TerminalContextProvider >
  </StrictMode>,
)
