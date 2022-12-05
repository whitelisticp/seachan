import React from "react"
import seachad from "../../assets/seachad.png"

const UserRole = ({ user }) => {
  return (
    <span>
      {Object.keys(user?.role)[0]}
      {Object.keys(user?.role)[0] == "SeaChad" && (
        <span>
          <img
            style={{
              marginLeft: ".5rem",
              width: "1.5rem",
            }}
            src={seachad}
          />
        </span>
      )}
    </span>
  )
}
export default UserRole
