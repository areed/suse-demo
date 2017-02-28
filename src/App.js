import React from 'react'
import { connect } from 'react-redux'
import { map } from 'ramda'
import SearchForm from './SearchForm'
import Tweet from './Tweet'

const mapStateToProps = (state, ownProps) => {
  return {
    tweets: state.tweets,
  }
}

const App = ({ tweets }) => (
  <div className="app">
    <SearchForm />
    <ul className="tweets">
      {map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ), tweets)}
    </ul>
  </div>
)

export default connect(mapStateToProps)(App)
