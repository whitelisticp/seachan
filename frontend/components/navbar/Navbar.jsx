import React from "react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { Auth } from "./Auth"
import { NavbarBoards } from "./NavbarBoards"
import { Theme } from "./Theme"

const Navbar = ({ setActor, setBoard, setUser, user, theme, setTheme }) => {
  return (
    <ul
      style={{
        padding: "2px 10px 2px 10px",
        borderBottom: "1px solid var(--border-color)",
        backgroundColor: "var(--post-header-color)",
        display: "flex",
        justifyContent: "space-between",
        listStyle: "none",
      }}
    >
      <li>
        <Link to="/">
          <FontAwesomeIcon icon={faHouse} />
        </Link>
      </li>
      <NavbarBoards user={user} setBoard={setBoard} />
      <li>
        <Theme theme={theme} setTheme={setTheme} />
        <Auth setActor={setActor} user={user} setUser={setUser} />
      </li>
    </ul>
  )
}
export default Navbar
