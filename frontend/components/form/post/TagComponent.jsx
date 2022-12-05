import React, { useState } from "react"
import LoadingSpinner from "../../ui/LoadingSpinner"
import { isMod } from "../../../utils/isMod"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTag } from "@fortawesome/free-solid-svg-icons"
export const TagComponent = function ({
  actor,
  user,
  post,
  setPost,
  showTag,
  setShowTag,
}) {
  const [isLoading, setLoading] = useState(false)

  var userRole = user === undefined ? { Anon: null } : user.role
  var postId = post.boardAbbreviation + "/" + post.id
  return (
    <>
      {!isLoading && (
        <>
          <FontAwesomeIcon
            icon={faTag}
            style={{
              cursor: "pointer",
            }}
            title={"Tag"}
            className="horizontal-padding"
            onClick={() => {
              setShowTag(!showTag)
            }}
          />
          <select
            style={{ lineHeight: "normal" }}
            required
            name="tag"
            disabled={isLoading}
            onChange={(e) => {
              setLoading(true)
              if (e.target.value == "none") {
                return
              } else {
                var tagVariant = { [e.target.value]: null }
              }
              actor.tagPost(postId, tagVariant, userRole).then((taggedPost) => {
                setLoading(false)
                setShowTag(!showTag)
                setPost(taggedPost["ok"])
              })
            }}
          >
            <option value="none" selected disabled hidden>
              Select tag
            </option>
            <option value="Based">Based</option>
            <option value="Cringe">Cringe</option>
          </select>
        </>
      )}
      {isLoading && <LoadingSpinner isSmall={true} />}
    </>
  )
}
