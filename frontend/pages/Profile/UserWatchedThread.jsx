import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

const UserWatchedThread = ({ actor, setUser, watchedThread }) => {
  const [isLoading, setLoading] = useState(false)
  const [threadObject, setThreadObject] = useState({})

  useEffect(() => {
    getWatchedThread(actor)
  }, [])

  const getWatchedThread = async () => {
    setLoading(true)
    actor.getPost(watchedThread).then((watchedThreadObj) => {
      setThreadObject(watchedThreadObj["ok"])
      setLoading(false)
    })
  }

  return (
    <p key={threadObject?.id}>
      <span
        style={{ float: "left" }}
        className="horizontal-padding"
        key={threadObject?.id}
      >
        {!isLoading && (
          <Link to={"/" + watchedThread.replace("/", "/thread/")}>
            <span>
              {threadObject?.boardAbbreviation + "#" + threadObject?.id}
            </span>
            {threadObject?.subject != "" ? (
              <span
                style={{
                  color: "var(--subject-color)",
                  fontWeight: "700",
                }}
              >
                {" - " + threadObject?.subject}
              </span>
            ) : (
              <span>{" - " + threadObject?.body.substring(0, 20)}</span>
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
            actor.removeWatchedThread(watchedThread).then((user) => {
              setUser(user["ok"])
              setLoading(false)
            })
          }}
        />
      )}
    </p>
  )
}
export default UserWatchedThread
