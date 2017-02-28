
The front-end is a React/Redux app bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

To start it run ```npm install && npm start```.

The backend is a Go websocket server that connects to Twitter's streaming API.
Generate a Twitter app at apps.twitter.com, then set the following environment variables:
* TWITTER_CONSUMER_KEY
* TWITTER_CONSUMER_SECRET
* TWITTER_ACCESS_TOKEN
* TWITTER_TOKEN_SECRET

Start it with ```go run server.go```

The server does not multiplex requests from multiple browser clients because it uses dev access tokens and would almost immediately hit Twitter's rate limits. Streaming from a second browser window will close the connection in the first.
