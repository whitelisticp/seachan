import React, { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import { Link } from "react-router-dom"

const UserHiddenPost = ({ actor, setUser, hiddenPost }) => {
  const [isLoading, setLoading] = useState(false)
  const [post, setPostObject] = useState({})

  useEffect(() => {
    getHiddenPost(actor)
  }, [])

  const getHiddenPost = async () => {
    setLoading(true)
    actor.getPost(hiddenPost).then((hiddenPostObj) => {
      setPostObject(hiddenPostObj["ok"])
      setLoading(false)
    })
  }

  var outLink =
    "/" +
    post?.threadKey?.replace("/", "/thread/") +
    (!post?.op ? "#" + post?.id : "")

  return (
    <p key={post?.id}>
      <span
        className="horizontal-padding"
        style={{ float: "left" }}
        key={hiddenPost}
      >
        {/* {hiddenPost} */}
        {!isLoading && (
          <Link to={outLink}>
            <span>{post?.boardAbbreviation + "#" + post?.id}</span>
            {post?.subject != "" ? (
              <span
                style={{
                  color: "var(--subject-color)",
                  fontWeight: "700",
                }}
              >
                {" - " + post?.subject}
              </span>
            ) : (
              <span>{" - " + post?.body.substring(0, 40)}</span>
            )}
          </Link>
        )}
      </span>
      {isLoading ? (
        <span>
          <LoadingSpinner isSmall={true} />
        </span>
      ) : (
        <FontAwesomeIcon
          icon={faXmark}
          style={{
            paddingLeft: "5px",
            float: "right",
            cursor: "pointer",
            color: "var(--danger-color-light)",
          }}
          onClick={() => {
            setLoading(true)
            actor.toggleHiddenPost(hiddenPost).then((user) => {
              setUser(user["ok"])
              setLoading(false)
            })
          }}
        />
      )}
    </p>
  )
}
export default UserHiddenPost
