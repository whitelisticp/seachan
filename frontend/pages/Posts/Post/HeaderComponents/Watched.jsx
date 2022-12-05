import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar } from "@fortawesome/free-solid-svg-icons"

export const Watched = function ({ post, user }) {
  return (
    user &&
    user.watchedThreads.includes(post.boardAbbreviation + "/" + post.id) && (
      <span>
        <FontAwesomeIcon
          title="Watched"
          style={{
            color: "#FFEA00",
            cursor: "pointer",
          }}
          icon={faStar}
        />
      </span>
    )
  )
}
