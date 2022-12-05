import React from "react"
import { useNavigate } from "react-router-dom"
import { isMobile } from "react-device-detect"

const PostViewForm = ({ postView, abbreviation, threadId, onPage }) => {
  let navigate = useNavigate()

  return (
    <span>
      <select
        value={postView}
        style={{fontSize: isMobile ? ".5rem" : "1rem",}}
        required
        name="View"
        onChange={(e) => {
          if (onPage == "board") {
            navigate("/" + abbreviation + "?view=" + e.target.value)
          } else {
            navigate(
              "/" +
                abbreviation +
                "/thread/" +
                threadId +
                "?view=" +
                e.target.value,
            )
          }
        }}
      >
        <option value="">Paged</option>
        <option value="catalog">Catalog</option>
        <option value="list">List</option>
      </select>
    </span>
  )
}
export default PostViewForm
