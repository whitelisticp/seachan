import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfo } from "@fortawesome/free-solid-svg-icons"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

const UserShowFlagged = ({ actor, user, setUser }) => {
  const [isLoading, setLoading] = useState(false)

  return (
    <div>
      <label className="horizontal-margin">
        {!isLoading ? (
          <input
            name="showFlagged"
            type="checkbox"
            className="horizontal-margin"
            checked={user.showFlagged}
            value={user.showFlagged}
            onChange={() => {
              setLoading(true)
              actor.toggleShowFlagged().then((updatedUser) => {
                setLoading(false)
                setUser(updatedUser["ok"])
              })
            }}
          />
        ) : (
          <span
            style={{
              paddingRight: "5px",
            }}
          >
            <LoadingSpinner isSmall={true} />
          </span>
        )}
        Always show flagged posts?
      </label>
      <FontAwesomeIcon
        onClick={() => {
          alert(
            "Enabling this option will show all posts that have been community moderated by the first 100 principals (SeaChads).",
          )
        }}
        style={{ marginLeft: "10px", cursor: "pointer" }}
        icon={faInfo}
      />
    </div>
  )
}

export default UserShowFlagged
