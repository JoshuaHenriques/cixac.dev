console.log("Worker spawned.")

importScripts("/wasm/wasm_exec.js")
const WASM_URL = "/wasm/main.wasm"

onmessage = async (e) => {
  console.log(`Message received from main script: ${e.data}`)

  const go = new Go()
  var wasm

  // polyfill for older browsers
  if ('instantiateStreaming' in WebAssembly) {
    WebAssembly.instantiateStreaming(fetch(WASM_URL), go.importObject).then(function (obj) {
      wasm = obj.instance;
      let oldLog = console.log;
      console.log = (line) => { postMessage({ message: line }) }
      go.argv = ["cixac", "-e", e.data]
      go.run(wasm).then((_) => {
        console.log = oldLog
        postMessage({
          done: true
        })
      })
    })
  } else {
    fetch(WASM_URL).then(resp => resp.arrayBuffer()).then(bytes =>
      WebAssembly.instantiate(bytes, go.importObject).then(function (obj) {
        wasm = obj.instance;
        let oldLog = console.log;
        console.log = (line) => { postMessage({ message: line }) }
        go.argv = ["cixac", "-e", e.data]
        go.run(wasm).then((_) => {
          console.log = oldLog
          postMessage({
            done: true
          })
        })
      })
    )
  }
}
