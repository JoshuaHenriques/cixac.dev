declare var importScripts: any
declare var jsRunProgram: any
declare var Go: any

console.log("Worker Spawned.")

importScripts("../../public/wasm/wasm_exec.js")

onmessage = (e) => {
  console.log(`Message received from main script: ${e.data}`)

  const go = new Go()
  var wasm: any

  const WASM_URL = "/wasm/main.wasm"
  if ('instantiateStreaming' in WebAssembly) {
    WebAssembly.instantiateStreaming(fetch(WASM_URL), go.importObject).then(function (obj) {
      wasm = obj.instance;
      go.argv = ["cixac", "-wasm"]
      go.run(wasm)
      postMessage(jsRunProgram(e.data))
    })
  } else {
    fetch(WASM_URL).then(resp => resp.arrayBuffer()).then(bytes =>
      WebAssembly.instantiate(bytes, go.importObject).then(function (obj) {
        wasm = obj.instance;
        go.argv = ["cixac", "-wasm"]
        go.run(wasm)
        postMessage(jsRunProgram(e.data))
      })
    )
  }
}
