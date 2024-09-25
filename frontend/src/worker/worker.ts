console.log("Worker spawned.")

importScripts("/wasm/wasm_exec.js")
const WASM_URL = "/wasm/main.wasm"

onmessage = async (e) => {
  const go = new Go();
  const input = e.data
  let result;

  try {
    if ('instantiateStreaming' in WebAssembly) {
      result = await WebAssembly.instantiateStreaming(fetch(WASM_URL), go.importObject);
    } else {
      const response = await fetch(WASM_URL);
      const bytes = await response.arrayBuffer();
      result = await WebAssembly.instantiate(bytes, go.importObject);
    }

    const oldLog = console.log;
    console.log = (line) => { postMessage({ message: line }); };

    try {
      go.argv = ["cixac", "-e", input];
      await go.run(result.instance);
      console.log("");
    } finally {
      console.log = oldLog;
    }
  } catch (error) {
    console.error("Error running WebAssembly:", error);
  }

  postMessage({ done: true });
};
