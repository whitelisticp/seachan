import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfo } from "@fortawesome/free-solid-svg-icons"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

const UserAutoLogin = ({ actor, user, setUser }) => {
  const [isLoading, setLoading] = useState(false)

  return (
    <div>
      <label className="horizontal-margin">
        {!isLoading ? (
          <input
            name="persistentAuthentication"
            type="checkbox"
            className="horizontal-margin"
            checked={user.persistentAuthentication}
            value={user.persistentAuthentication}
            onChange={() => {
              setLoading(true)
              actor.togglePersistentAuthentication().then((updatedUser) => {
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
        Enable Auto Login?
      </label>
      <FontAwesomeIcon
        onClick={() => {
          alert(
            "Enabling persistant authentication will use a browser storage variable to re-log you in to the correct wallet after a page refresh.",
          )
        }}
        style={{ marginLeft: "10px", cursor: "pointer" }}
        icon={faInfo}
      />
    </div>
  )
}

export default UserAutoLogin
