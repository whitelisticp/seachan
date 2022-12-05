import React, { useEffect } from "react"
import Table from "react-bootstrap/Table"
import { Link } from "react-router-dom"
import { timeSince } from "../../utils/timeSince"
import { allowedThroughGate } from "../../utils/allowedThroughGate"
import { isAdmin } from "../../utils/isAdmin"
import { compareValues } from "../../utils/compareValues"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowsRotate,
  faLock,
  faLockOpen,
} from "@fortawesome/free-solid-svg-icons"
import { seachan_backend } from "../../../src/declarations/seachan_backend"

const BoardList = ({
  listedBoards,
  setListedBoards,
  setBoard,
  user,
  theme,
}) => {
  useEffect(() => {
    seachan_backend.getListedBoards().then((boardResult) => {
      setListedBoards(
        boardResult["ok"].sort(
          compareValues("latestActivityTimeStamp", "desc"),
        ),
      )
    })
  }, [])

  const BoardTable = ({ listedBoards }) => {
    return (
      <Table
        striped
        variant={theme}
        size="sm"
        style={{
          textAlign: "center",
          width: "fit-content",
          margin: "auto",
          color: "var(--text-color)",
        }}
      >
        <thead>
          <tr>
            <th style={{ backgroundColor: "var(--post-header-color)" }}>
              Board
            </th>
            <th style={{ backgroundColor: "var(--post-header-color)" }}>
              Name
            </th>
            <th style={{ backgroundColor: "var(--post-header-color)" }}>
              Threads
            </th>
            {/* <th>Posts</th> */}
            <th style={{ backgroundColor: "var(--post-header-color)" }}>
              Latest
            </th>
            {/* <th style={{ backgroundColor: "var(--post-header-color)" }}>Tags</th> */}
          </tr>
        </thead>
        <tbody>
          {listedBoards?.map((board) => {
            return <BoardTableRow board={board} />
          })}
        </tbody>
      </Table>
    )
  }

  const BoardTableRow = ({ board }) => {
    var isAllowed = isAdmin(user) ? true : allowedThroughGate(user, board)
    return (
      <tr key={board.abbreviation}>
        {/* board */}
        <td>
          {isAllowed ? (
            <Link
              onClick={() => {
                setBoard(board)
              }}
              to={"/" + board.abbreviation}
              board={board}
            >
              /{board.abbreviation}/
            </Link>
          ) : (
            <span
              onClick={() => {
                alert(
                  "You don't meet the requirements to access this board:\n" +
                    (board.gateType == "tokens"
                      ? board.gateTokenAmount + " " + board.gateToken
                      : board.gateToken) +
                    " in Plug wallet\n" +
                    "(You may need to go to the profile page and sync ICP first to unlock)",
                )
              }}
            >
              /{board.abbreviation}/
            </span>
          )}
        </td>
        {/* name */}
        <td>
          {isAllowed ? (
            <Link
              onClick={() => {
                setBoard(board)
              }}
              to={"/" + board.abbreviation}
              board={board}
            >
              {board.name}
            </Link>
          ) : (
            <span
              onClick={async () => {
                alert(
                  "You don't meet the requirements to access this board:\n" +
                    (board.gateType == "tokens"
                      ? board.gateTokenAmount + " " + board.gateToken
                      : board.gateToken) +
                    " in Plug wallet\n" +
                    "(You may need to go to the profile page and sync ICP first to unlock)",
                )
              }}
            >
              {board.name}
            </span>
          )}
          {board.gated && !isAllowed && (
            <FontAwesomeIcon
              className="horizontal-padding"
              title="Locked"
              icon={faLock}
            />
          )}
          {board.gated && isAllowed && (
            <FontAwesomeIcon
              className="horizontal-padding"
              title="Unlocked"
              icon={faLockOpen}
            />
          )}
        </td>
        {/* thread count */}
        <td>{board.threadCount.toString()}</td>
        {/* post count */}
        {/* <td>
                    { 
                        (board.postCount).toString()
                    }
                </td> */}
        {/* time stamp */}
        <td>{timeSince(board.latestActivityTimeStamp)} ago</td>
      </tr>
    )
  }

  return (
    <>
      <span
        style={{
          marginBottom: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "1.5em" }}>Boards</span>
        <FontAwesomeIcon
          style={{ marginLeft: "10px", cursor: "pointer" }}
          onClick={() => {
            seachan_backend.getListedBoards().then((boardResult) => {
              setListedBoards(
                boardResult["ok"].sort(
                  compareValues("latestActivityTimeStamp", "desc"),
                ),
              )
            })
          }}
          icon={faArrowsRotate}
        />
      </span>
      <BoardTable listedBoards={listedBoards} />
      <br />
    </>
  )
}
export default BoardList
