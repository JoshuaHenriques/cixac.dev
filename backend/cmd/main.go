package main

import (
	"bufio"
	"flag"
	"fmt"
	"io"
	"log"
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gorilla/websocket"
)

const (
	pongWait         = 60 * time.Second
	pingPeriod       = (pongWait * 9) / 10
	writeWait        = 10 * time.Second
	closeGracePeriod = 10 * time.Second
	maxMessageSize   = 8192
)

var frontendPath string

func internalError(ws *websocket.Conn, msg string, err error) {
	log.Println(msg, err)
	ws.WriteMessage(websocket.TextMessage, []byte("Internal server error."))
}

func pumpStdin(ws *websocket.Conn, w io.Writer) {
	defer ws.Close()
	ws.SetReadLimit(maxMessageSize)
	ws.SetReadDeadline(time.Now().Add(pongWait))
	ws.SetPongHandler(func(string) error { ws.SetReadDeadline(time.Now().Add(pongWait)); return nil })

	for {
		_, message, err := ws.ReadMessage()
		if err != nil {
			break
		}
		message = append(message, '\n')
		if _, err := w.Write(message); err != nil {
			break
		}
	}
}

func pumpStdout(ws *websocket.Conn, r io.Reader, done chan struct{}) {
	s := bufio.NewScanner(r)

	for s.Scan() {
		ws.SetWriteDeadline(time.Now().Add(writeWait))
		if err := ws.WriteMessage(websocket.TextMessage, s.Bytes()); err != nil {
			ws.Close()
			break
		}
	}
	if s.Err() != nil {
		log.Println("scan:", s.Err())
	}

	close(done)

	ws.SetWriteDeadline(time.Now().Add(writeWait))
	ws.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
	time.Sleep(closeGracePeriod)
	ws.Close()
}

func ping(ws *websocket.Conn, done chan struct{}) {
	ticker := time.NewTicker(pingPeriod)
	defer ticker.Stop()
	for {
		select {
		case <-ticker.C:
			if err := ws.WriteControl(websocket.PingMessage, []byte{}, time.Now().Add(writeWait)); err != nil {
				log.Println("ping:", err)
			}
		case <-done:
			return
		}
	}
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func serveWs(w http.ResponseWriter, r *http.Request) {
	// fmt.Printf("r: %+v\n", r)
	// todo: change function
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("upgrade:", err)
		return
	}
	defer ws.Close()

	outr, outw, err := os.Pipe()
	if err != nil {
		internalError(ws, "stdout:", err)
		return
	}
	defer outr.Close()
	defer outw.Close()

	inr, inw, err := os.Pipe()
	if err != nil {
		internalError(ws, "stdin:", err)
		return
	}
	defer inr.Close()
	defer inw.Close()

	cwd, err := os.Getwd()
	if err != nil {
		internalError(ws, "getwd:", err)
		return
	}

	cixacPath := filepath.Join(cwd, "bin", "cixac")
	cixacPath, err = filepath.Abs(cixacPath)
	if err != nil {
		internalError(ws, "abs path:", err)
		return
	}

	proc, err := os.StartProcess(cixacPath, []string{"cixac"}, &os.ProcAttr{
		Files: []*os.File{inr, outw, outw},
	})
	if err != nil {
		internalError(ws, "start:", err)
		return
	}

	inr.Close()
	outw.Close()

	stdoutDone := make(chan struct{})
	go pumpStdout(ws, outr, stdoutDone)
	go ping(ws, stdoutDone)

	pumpStdin(ws, inw)

	inw.Close()

	if _, err := proc.Wait(); err != nil {
		log.Println("wait:", err)
	}
}

func index(w http.ResponseWriter, r *http.Request) {
	path := filepath.Join(frontendPath, r.URL.Path)

	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		http.ServeFile(w, r, filepath.Join(frontendPath, "index.html"))
		return
	}

	if ext := filepath.Ext(path); ext != "" {
		var mimeType string
		if ext == ".js" || ext == ".ts" {
			mimeType = "application/javascript"
		} else {
			mimeType = mime.TypeByExtension(ext)
		}
		if mimeType != "" {
			w.Header().Set("Content-Type", mimeType)
		}
	}

	if filepath.Base(path) == "worker.ts" {
		w.Header().Set("Service-Worker-Allowed", "/")
	}

	http.ServeFile(w, r, path)

	log.Printf("Served file: %s", path)
}

func main() {
	flag.Parse()
	r := http.NewServeMux()
	r.HandleFunc("/v1/ws", serveWs)

	currentDir, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}

	frontendPath = filepath.Join(currentDir, "..", "frontend", "dist")

	if _, err := os.Stat(frontendPath); os.IsNotExist(err) {
		log.Fatalf("Frontend directory does not exist: %s", frontendPath)
	}

	r.HandleFunc("/", index)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	srv := &http.Server{
		Handler:      r,
		Addr:         "0.0.0.0:" + port,
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	fmt.Printf("Server started on PORT: %s\n", port)
	fmt.Printf("Serving frontend from: %s\n", frontendPath)
	log.Fatal(srv.ListenAndServe())
}
