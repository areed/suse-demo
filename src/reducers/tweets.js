import { slice, prepend } from 'ramda'

const MAX = 50

export default (state = [], action) => {
  switch (action.type) {
    case 'NEW_TWEET':
      // newest go to the front of the list
      return slice(0, MAX, prepend({
        id: action.data.id_str,
        text: action.data.text,
        profile: action.data.user.profile_image_url,
        username: action.data.user.name,
      }, state))
    case 'SEARCH':
      return []
    default:
      return state;
  }
}
