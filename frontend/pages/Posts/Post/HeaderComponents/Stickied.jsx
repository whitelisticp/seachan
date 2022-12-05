import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faThumbtack } from "@fortawesome/free-solid-svg-icons"

export const Stickied = function ({ post }) {
  return (
    post.stickied &&
    !post.flagged && (
      <span>
        <FontAwesomeIcon title="Stickied" icon={faThumbtack} />
      </span>
    )
  )
}
