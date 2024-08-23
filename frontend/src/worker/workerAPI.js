export function getWorker() {
  return new Worker("./src/worker/worker.js")
}

export function useWorker(worker, code, callback) {
  const promise = new Promise((resolve, reject) => {
    worker.onmessage = (event) => {
      if (event.data.done) {
        resolve()
        return
      }

      if (event.data.error) {
        reject()
        return
      }
      callback(event.data.message)
    }
  })
  worker.postMessage(code)
  return promise
}

export function terminateWorker(worker) {
  worker.terminate()
  console.log("Worker terminated")
}
