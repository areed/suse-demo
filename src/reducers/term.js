
export default (state = '', action) => {
  switch (action.type) {
    case 'SEARCH':
      return action.term
    default:
      return state;
  }
}
