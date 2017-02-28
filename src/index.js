import './styles.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'

import tweets from './reducers/tweets'
import term from './reducers/term'
import feed from './feed'
import App from './App'

const store = createStore(combineReducers({
  tweets,
  term,
}))

// watches the search term and requests relevant tweets from server
feed(store)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
