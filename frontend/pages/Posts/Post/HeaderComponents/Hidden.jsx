import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons"

export const Hidden = function ({ post }) {
  return (
    post.hidden &&
    !post.flagged && (
      <span>
        <FontAwesomeIcon title="Hidden" icon={faEyeSlash} />
      </span>
    )
  )
}
