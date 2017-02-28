package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"

	"github.com/dghubble/oauth1"
	"github.com/gorilla/websocket"
)

// pre-authorized client
var client *http.Client

type user struct {
	Name            string `json:"name"`
	ProfileImageURL string `json:"profile_image_url"`
}

type tweet struct {
	ID   string `json:"id_str"`
	Text string `json:"text"`
	User *user  `json:"user"`
}

func main() {
	// from (e.g.) https://apps.twitter.com/app/13462522/keys
	config := oauth1.NewConfig(os.Getenv("TWITTER_CONSUMER_KEY"), os.Getenv("TWITTER_CONSUMER_SECRET"))
	token := oauth1.NewToken(os.Getenv("TWITTER_ACCESS_TOKEN"), os.Getenv("TWITTER_TOKEN_SECRET"))
	client = config.Client(oauth1.NoContext, token)
	// the websocket endpoint
	http.HandleFunc("/tweets", handler)

	log.Fatal(http.ListenAndServe(":8000", nil))
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	// allow cross origin connections
	CheckOrigin: func(r *http.Request) bool { return true },
}

func handler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	defer conn.Close()
	// ignoring message type; term is []byte
	_, term, err := conn.ReadMessage()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	params := &url.Values{}
	params.Add("track", string(term))
	req, err := http.NewRequest("GET", "https://stream.twitter.com/1.1/statuses/filter.json?"+params.Encode(), nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	req.Header.Add("Accept", "application/json")
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		log.Printf("Twitter streaming endpoint responded with %d", resp.StatusCode)
		errMsg, _ := ioutil.ReadAll(resp.Body)
		log.Println(string(errMsg))
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	stream := bufio.NewScanner(resp.Body)
	// adapted from bufio.ScanLines, which can't be used because tweets can have newlines.
	// Tweets are delimited by carriage return and newline.
	stream.Split(func(data []byte, atEOF bool) (advance int, token []byte, err error) {
		if atEOF && len(data) == 0 {
			return 0, nil, nil
		}
		if i := bytes.Index(data, []byte{'\r', '\n'}); i >= 0 {
			return i + 1, data[0:i], nil
		}
		if atEOF {
			return len(data), data, nil
		}
		// requeust more data
		return 0, nil, nil
	})

	// When the websocket client closes we'll get an error writing to it.
	// Then this handler will exit and the connection to Twitter will close.
	for stream.Scan() {
		tw := &tweet{}
		if err := json.Unmarshal(stream.Bytes(), tw); err != nil {
			continue
		}
		buf, err := json.Marshal(tw)
		if err != nil {
			log.Printf("Failed to marshal %+v", tw)
			continue
		}
		if err := conn.WriteMessage(websocket.TextMessage, buf); err != nil {
			break
		}
	}
}
