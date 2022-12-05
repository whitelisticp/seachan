import React, { useState } from "react"
import { clearMinimizedPosts } from "../../utils/clearMinimizedPosts"
import UserMinimizedPost from "./UserMinimizedPost"

const UserMinimizedPosts = ({ actor, user, setUser }) => {
  const [isLoading, setLoading] = useState(false)
  return (
    <div>
      <span>
        {user?.minimizedPosts.length > 0
          ? user?.minimizedPosts.map((minimizedPost) => {
              return (
                <UserMinimizedPost
                  actor={actor}
                  setUser={setUser}
                  minimizedPost={minimizedPost}
                />
              )
            })
          : "None Found"}
      </span>
      {user?.minimizedPosts.length > 0 && (
        <button
          style={{
            margin: "5px",
            backgroundColor: "var(--danger-color)",
            color: "var(--text-color)",
          }}
          onClick={() => clearMinimizedPosts(actor, setUser, setLoading)}
          disabled={isLoading}
        >
          {!isLoading ? "Clear" : "Clearing..."}
        </button>
      )}
    </div>
  )
}
export default UserMinimizedPosts
