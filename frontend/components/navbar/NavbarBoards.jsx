import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { allowedThroughGate } from "../../utils/allowedThroughGate"
import { compareValues } from "../../utils/compareValues"
import { seachan_backend } from "../../../src/declarations/seachan_backend"

export function NavbarBoards({ user, setBoard }) {
  const [navbarBoards, setNavbarBoards] = useState([])

  useEffect(() => {
    seachan_backend.getListedBoards().then((boardResult) => {
      var navBarBoards = boardResult["ok"].filter((x) =>
        user?.navbarBoards.includes(x.abbreviation),
      )
      var navBarBoardsSorted = navBarBoards.sort(
        compareValues("latestActivityTimeStamp", "desc"),
      )
      setNavbarBoards(navBarBoardsSorted)
    })
  }, [user?.navbarBoards])

  return navbarBoards?.map((board) => {
    var isAllowed = allowedThroughGate(user, board)
    return (
      <li key={board.abbreviation}>
        {isAllowed ? (
          <Link
            onClick={() => {
              setBoard(board)
            }}
            to={"/" + board.abbreviation}
            board={board}
          >
            [{board.abbreviation}]
          </Link>
        ) : (
          <span
            onClick={() => {
              alert(
                "You don't meet the requirements to access this board:\n" +
                  (board.gateType == "tokens"
                    ? board.gateTokenAmount + " " + board.gateToken
                    : board.gateToken) +
                  " in Plug or Stoic wallet\n" +
                  "(You may need to go to the profile page and sync ICP first to unlock)",
              )
            }}
          >
            [{board.abbreviation}]
          </span>
        )}
      </li>
    )
  })
}
export default NavbarBoards
