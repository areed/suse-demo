import React from 'react'

const Tweet = ({username, profile, text}) => {
  // already escaped by Twitter API
  const body = {
    __html: text,
  }

  return (
    <li className="tweet">
      <p className="user">
        <img src={profile} alt="profile" />
        {username}
      </p>
      <p className="tweet-text" dangerouslySetInnerHTML={body} />
    </li>
  )
}

export default Tweet
