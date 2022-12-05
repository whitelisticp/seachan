import React, { useState } from "react"
import { UserNameForm } from "../../components/form/user/UserNameForm"
import { clearUserNames } from "../../utils/clearUserNames"
import UserName from "./UserName"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

const UserNames = ({ actor, user, setUser }) => {
  const [showUsernameForm, setShowUserNameForm] = useState(false)
  const [isClearLoading, setClearLoading] = useState(false)
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          columnGap: "1rem",
        }}
      >
        {user?.userNames.length > 0 &&
          user?.userNames.map((userName) => (
            <UserName actor={actor} setUser={setUser} userName={userName} />
          ))}
      </div>
      <div>
        <button
          style={{
            margin: "5px",
            backgroundColor: "var(--success-color)",
            color: "var(--text-color)",
          }}
          onClick={() => setShowUserNameForm(!showUsernameForm)}
        >
          Claim
        </button>
        {showUsernameForm && (
          <UserNameForm
            actor={actor}
            setUser={setUser}
            setShowUserNameForm={setShowUserNameForm}
          />
        )}
        {user?.userNames.length > 0 && (
          <button
            style={{
              margin: "5px",
              backgroundColor: "var(--danger-color)",
              color: "var(--text-color)",
            }}
            onClick={() => clearUserNames(actor, setUser, setClearLoading)}
            disabled={isClearLoading}
          >
            {!isClearLoading ? (
              "Clear"
            ) : (
              <span
                style={{
                  paddingLeft: "5px",
                }}
              >
                <LoadingSpinner isSmall={true} />
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
export default UserNames
