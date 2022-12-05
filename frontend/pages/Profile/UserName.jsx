import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

const UserName = ({ actor, setUser, userName }) => {
  const [isLoading, setLoading] = useState(false)
  return (
    <span key={userName}>
      {userName}
      {isLoading ? (
        <span
          style={{
            marginLeft: "5px",
          }}
        >
          <LoadingSpinner isSmall={true} />
        </span>
      ) : (
        <FontAwesomeIcon
          icon={faXmark}
          style={{
            marginLeft: "5px",
            cursor: "pointer",
            color: "var(--danger-color-light)",
          }}
          onClick={() => {
            setLoading(true)
            actor.removeUserName(userName).then((user) => {
              setUser(user["ok"])
              setLoading(false)
            })
          }}
        />
      )}
    </span>
  )
}
export default UserName
