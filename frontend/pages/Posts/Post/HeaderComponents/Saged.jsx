import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLeaf } from "@fortawesome/free-solid-svg-icons"

export const Saged = function ({ post }) {
  return (
    post.saged && (
      <span>
        <FontAwesomeIcon
          title="Saged"
          icon={faLeaf}
          style={{
            color: "var(--sage-color)",
          }}
        />
      </span>
    )
  )
}
