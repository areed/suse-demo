import newTweet from './actions/newTweet'

export default (store) => {
  let ws = null
  let term = ''
  const watch = (term) => {
    if (ws) {
      ws.close()
      ws = null
    }
    if (term) {
      ws = new WebSocket('ws://localhost:8000/tweets')
      ws.onmessage = (msg) => {
        store.dispatch(newTweet(JSON.parse(msg.data)))
      }
      ws.onopen = () => ws.send(term)
    }
  }

  store.subscribe(() => {
    const state = store.getState()
    if (state.term !== term) {
      term = state.term
      watch(term)
    }
  })
}
