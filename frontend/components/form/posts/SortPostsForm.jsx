import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons"
import { isMobile } from "react-device-detect"

const SortPostsForm = ({ sortDesc, setSortDesc, sortBy, setSortBy }) => {
  const sortThreads = async (toggle) => {
    var sortBy = document.getElementsByName("sortBy")[0].value
    setSortBy(sortBy)
    if (toggle) {
      setSortDesc(sortDesc == "desc" ? "asc" : "desc")
    }
  }

  return (
    <span>
      <select
        value={sortBy}
        style={{ fontSize: isMobile ? ".5rem" : "1rem" }}
        required
        name="sortBy"
        onChange={() => sortThreads(false)}
      >
        <option value="latestActivityTimeStamp">Bump Order</option>
        <option value="timeStamp">Creation Date</option>
        <option value="replyCount">Reply Count</option>
        <option value="fileCount">File Count</option>
        <option value="reportCount">Reports</option>
        <option value="icpBalance">ICP Balance</option>
        <option value="icpReceived">ICP Received</option>
      </select>
      <FontAwesomeIcon
        style={{ cursor: "pointer" }}
        icon={sortDesc == "desc" ? faSortDown : faSortUp}
        title="Sort"
        className="fa pointer horizontal-padding"
        onClick={() => {
          sortThreads(true)
        }}
      />
    </span>
  )
}
export default SortPostsForm
