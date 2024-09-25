export function getWorker() {
  return new Worker(new URL('/src/worker/worker.js', import.meta.url))
}

export function useWorker(worker: Worker, code: string, callback: (message: string) => void) {
  const promise = new Promise((resolve: (value?: unknown) => void, reject) => {
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

export function terminateWorker(worker: Worker) {
  worker.terminate()
  console.log("Worker terminated")
}
