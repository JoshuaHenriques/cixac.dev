import '@mantine/core/styles.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TerminalContextProvider } from 'react-terminal'
import App from './App.tsx'
import { createTheme, MantineProvider } from '@mantine/core'
import classes from './main.module.css'

const theme = createTheme({
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  colors: {
    blueGrey: [
      "#f3f3fe",
      "#e4e6ed",
      "#c8cad3",
      "#a9adb9",
      "#9093a4",
      "#808496",
      "#767c91",
      "#656a7e",
      "#585e72",
      "#4a5167"
    ],
  },
  activeClassName: classes.active,
  primaryColor: 'blueGrey',
  defaultRadius: 'sm'
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TerminalContextProvider>
      <MantineProvider theme={theme}>
        <App />
      </MantineProvider>
    </TerminalContextProvider >
  </StrictMode >,
)
