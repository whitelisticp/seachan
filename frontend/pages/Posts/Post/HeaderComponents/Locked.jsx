import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLock } from "@fortawesome/free-solid-svg-icons"

export const Locked = function ({ post }) {
  return (
    post.locked &&
    !post.flagged && (
      <FontAwesomeIcon
        title="Locked"
        icon={faLock}
      />
    )
  )
}
