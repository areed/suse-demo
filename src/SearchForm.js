import React, { Component } from 'react'
import { connect } from 'react-redux'
import search from './actions/search'

const mapStateToProps = (state, ownProps) => {
  return {
    term: state.term,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (term) => dispatch(search(term)),
  }
}

class SearchForm extends Component {
  constructor(props) {
    super(props)
    this.state = {term: ''}
    this.onChange = this.onChange.bind(this)
    this.onSearch = this.onSearch.bind(this)
  }

  onChange(e) {
    this.setState({
      term: e.target.value,
    })
  }

  onSearch(e) {
    e.preventDefault()
    this.props.onSubmit(this.state.term)
  }

  render() {
    return (
      <form className="search-form" onSubmit={this.onSearch}>
        <input className="term-field" type="text" name="term" placeholder="linux" value={this.state.term} onChange={this.onChange} required />
        <button type="submit">Search</button>
        {this.props.term && <p>Showing tweets matching: <span className="search-term">{this.props.term}</span></p>}
      </form>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm)
