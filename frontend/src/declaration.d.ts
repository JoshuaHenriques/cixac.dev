declare module '*.md?raw' {
  const content: string
  export default content
}

declare module '*.module.css'

declare const importScripts: (path: string) => void

declare const Go: any
