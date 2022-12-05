import React, { useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons"

const BoardPagination = ({
  nPages,
  currentPage,
  setCurrentPage,
  boardAbbreviation,
  postView,
}) => {
  const pageNumbers = [...Array(nPages + 1).keys()].slice(1)

  const nextPage = () => {
    if (currentPage !== nPages) setCurrentPage(currentPage + 1)
  }
  const prevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1)
  }

  useEffect(() => {
    window.history.replaceState(
      null,
      "",
      "/" +
        boardAbbreviation +
        "/" +
        currentPage +
        (postView == "catalog" ? "?view=catalog" : ""),
    )
  }, [currentPage])

  return (
    <>
      {/* <span style={{ marginRight: "5px" }}>page</span> */}
      {currentPage != 1 && (
        <span
          style={{ cursor: "pointer", marginRight: "5px" }}
          onClick={prevPage}
        >
          <FontAwesomeIcon title="First" icon={faArrowLeft} />
        </span>
      )}
      <span style={{ marginRight: "5px" }}>
        <select
          onChange={(e) => {
            setCurrentPage(parseInt(e.target.value))
          }}
        >
          {pageNumbers.map((value) => (
            <option key={value} value={value} selected={value == currentPage}>
              {" "}
              {value}
            </option>
          ))}
        </select>
      </span>
      {currentPage != nPages && (
        <span
          style={{ cursor: "pointer", marginRight: "5px" }}
          onClick={nextPage}
        >
          <FontAwesomeIcon title="First" icon={faArrowRight} />
        </span>
      )}
      of
      <span
        style={{ cursor: "pointer", marginLeft: "5px" }}
        onClick={() => setCurrentPage(nPages)}
      >
        {nPages}
      </span>
      <br />
    </>
  )
}

export default BoardPagination
