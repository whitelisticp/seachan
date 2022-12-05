import React, { useState } from "react"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

const UserShowNsfw = ({ actor, user, setUser }) => {
  const [isLoading, setLoading] = useState(false)

  return (
    <label className="horizontal-margin">
      {!isLoading ? (
        <input
          name="showNsfw"
          type="checkbox"
          className="horizontal-margin"
          checked={user.showNsfw}
          value={user.showNsfw}
          onChange={() => {
            setLoading(true)
            actor.toggleShowNsfw().then((updatedUser) => {
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
      Always show nsfw files?
    </label>
  )
}

export default UserShowNsfw
