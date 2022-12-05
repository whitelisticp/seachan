import React, { useState } from "react"
import UserWatchedThread from "./UserWatchedThread"
import { clearWatchedThreads } from "../../utils/clearWatchedThreads"

const UserWatchedThreads = ({ actor, user, setUser }) => {
  const [isLoading, setLoading] = useState(false)
  return (
    <div>
      <span>
        {user?.watchedThreads.length > 0
          ? user?.watchedThreads.map((watchedThread) => {
              return (
                <UserWatchedThread
                  actor={actor}
                  setUser={setUser}
                  watchedThread={watchedThread}
                />
              )
            })
          : "None Found"}
      </span>
      {user?.watchedThreads.length > 0 && (
        <div>
          <button
            style={{
              margin: "5px",
              backgroundColor: "var(--danger-color)",
              color: "var(--text-color)",
            }}
            onClick={() => clearWatchedThreads(actor, setUser, setLoading)}
            disabled={isLoading}
          >
            {!isLoading ? "Clear" : "Clearing..."}
          </button>
        </div>
      )}
    </div>
  )
}
export default UserWatchedThreads
