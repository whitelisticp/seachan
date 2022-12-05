import React, { useState } from "react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

const UserNavbarBoard = ({ actor, setUser, navBarBoard }) => {
  const [isLoading, setLoading] = useState(false)
  return (
    <span key={navBarBoard}>
      <span key={navBarBoard}>
        <Link to={"/" + navBarBoard}>/{navBarBoard}/</Link>
      </span>
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
            actor.removeNavBarBoard(navBarBoard).then((user) => {
              setUser(user["ok"])
              setLoading(false)
            })
          }}
        />
      )}
    </span>
  )
}
export default UserNavbarBoard
