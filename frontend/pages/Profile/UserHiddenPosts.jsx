import React, { useState } from "react"
import { clearHiddenPosts } from "../../utils/clearHiddenPosts"
import UserHiddenPost from "./UserHiddenPost"

const UserHiddenPosts = ({ actor, user, setUser }) => {
  const [isLoading, setLoading] = useState(false)
  return (
    <div>
      <span>
        {user?.hiddenPosts.length > 0
          ? user?.hiddenPosts.map((hiddenPost) => {
              return (
                <UserHiddenPost
                  actor={actor}
                  setUser={setUser}
                  hiddenPost={hiddenPost}
                />
              )
            })
          : "None Found"}
      </span>
      {user?.hiddenPosts.length > 0 && (
        <button
          style={{
            margin: "5px",
            backgroundColor: "var(--danger-color)",
            color: "var(--text-color)",
          }}
          onClick={() => clearHiddenPosts(actor, setUser, setLoading)}
          disabled={isLoading}
        >
          {!isLoading ? "Clear" : "Clearing..."}
        </button>
      )}
    </div>
  )
}
export default UserHiddenPosts
