import React, { useState } from "react"
import UserNavbarBoard from "./UserNavbarBoard"
import { UserNavbarBoardForm } from "../../components/form/user/UserNavbarBoardForm"
import { clearNavbarBoards } from "../../utils/clearNavbarBoards"

const UserNavbarBoards = ({ actor, user, setUser, listedBoards }) => {
  const [isLoading, setLoading] = useState(false)
  const [showNavbarBoardsForm, setShowNavbarBoardsForm] = useState(false)
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          columnGap: "1rem",
        }}
      >
        {user?.navbarBoards.length > 0
          ? user?.navbarBoards.map((navBarBoard) => {
              return (
                <UserNavbarBoard
                  actor={actor}
                  setUser={setUser}
                  navBarBoard={navBarBoard}
                />
              )
            })
          : "None Found"}
      </div>
      <div>
        {listedBoards.length > 0 && (
          <button
            style={{
              margin: "5px",
              backgroundColor: "var(--success-color)",
              color: "var(--text-color)",
            }}
            onClick={() => setShowNavbarBoardsForm(!showNavbarBoardsForm)}
          >
            Add
          </button>
        )}
        {showNavbarBoardsForm && (
          <UserNavbarBoardForm
            actor={actor}
            user={user}
            setUser={setUser}
            setShowNavbarBoardsForm={setShowNavbarBoardsForm}
            listedBoards={listedBoards}
          />
        )}
        {user?.navbarBoards.length > 0 && (
          <button
            style={{
              margin: "5px",
              backgroundColor: "var(--danger-color)",
              color: "var(--text-color)",
            }}
            onClick={() => clearNavbarBoards(actor, setUser, setLoading)}
            disabled={isLoading}
          >
            {!isLoading ? "Clear" : "Clearing..."}
          </button>
        )}
      </div>
    </div>
  )
}
export default UserNavbarBoards
