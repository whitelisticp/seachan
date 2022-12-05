import React, { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import { Link } from "react-router-dom"

const UserMinimizedPost = ({ actor, setUser, minimizedPost }) => {
  const [isLoading, setLoading] = useState(false)
  const [post, setPostObject] = useState({})

  useEffect(() => {
    getMinimizedPost(actor)
  }, [])

  const getMinimizedPost = async () => {
    setLoading(true)
    actor.getPost(minimizedPost).then((minimizedPostObj) => {
      setPostObject(minimizedPostObj["ok"])
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
        key={minimizedPost}
      >
        {/* {minimizedPost} */}
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
            actor.toggleMinimizedPost(minimizedPost).then((user) => {
              setUser(user["ok"])
              setLoading(false)
            })
          }}
        />
      )}
    </p>
  )
}
export default UserMinimizedPost
