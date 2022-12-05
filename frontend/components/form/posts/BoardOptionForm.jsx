import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowsRotate, faGear } from "@fortawesome/free-solid-svg-icons"
import SortPostsForm from "./SortPostsForm"
import PostViewForm from "./PostViewForm"
import { isAuthenticated } from "../../../utils/isAuthenticated"
import { isMobile } from "react-device-detect"

const BoardOptionForm = ({
  abbreviation,
  user,
  posts,
  setPosts,
  refreshPosts,
  setRefreshPosts,
  showAllNsfw,
  setShowAllNsfw,
  showAllFlagged,
  setShowAllFlagged,
  postView,
  sortDesc,
  setSortDesc,
  sortBy,
  setSortBy,
  onPage,
}) => {
  const [showPostsOptions, setShowPostsOptions] = useState(false)
  const [postsOptionLoading, setPostsOptionLoading] = useState(false)
  return (
    <span style={{ flexGrow: "1", flexBasis: "0", textAlign: "right" }}>
      {/* sort by */}
      <SortPostsForm
        posts={posts}
        setPosts={setPosts}
        setRefreshPosts={setRefreshPosts}
        sortDesc={sortDesc}
        setSortDesc={setSortDesc}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      {/* view */}
      <PostViewForm
        posts={posts}
        setPosts={setPosts}
        setRefreshPosts={setRefreshPosts}
        sortDesc={sortDesc}
        setSortDesc={setSortDesc}
        sortBy={sortBy}
        setSortBy={setSortBy}
        postView={postView}
        abbreviation={abbreviation}
        threadId={null}
        onPage={onPage}
      />
      <br />

      {postsOptionLoading && <LoadingSpinner isSmall={true} />}

      {showPostsOptions && !postsOptionLoading && (
        <select
          style={{
            lineHeight: "normal",
            fontSize: isMobile ? ".5rem" : "1rem",
          }}
          required
          name="options"
          disabled={postsOptionLoading}
          onChange={(e) => {
            if (e.target.value == "none") {
              return
            } else if (e.target.value == "ToggleAllNSFW") {
              setPostsOptionLoading(true)
              setShowAllNsfw(!showAllNsfw)
              setRefreshPosts(!refreshPosts)
              setPostsOptionLoading(false)
              setShowPostsOptions(false)
            } else if (
              e.target.value == "ToggleAllFlagged" &&
              isAuthenticated(user)
            ) {
              setPostsOptionLoading(true)
              setShowAllFlagged(!showAllFlagged)
              setRefreshPosts(!refreshPosts)
              setPostsOptionLoading(false)
              setShowPostsOptions(false)
            } else if (e.target.value == "RefreshPosts") {
              setPostsOptionLoading(true)
              setRefreshPosts(!refreshPosts)
              setPostsOptionLoading(false)
              setShowPostsOptions(false)
            }
          }}
        >
          <option value="none" selected disabled hidden>
            Select Option
          </option>
          <option value="ToggleAllNSFW">
            {showAllNsfw ? "Hide All NSFW" : "Show All NSFW"}
          </option>
          {isAuthenticated(user) && (
            <option value="ToggleAllFlagged">
              {showAllFlagged ? "Hide All Flagged" : "Show All Flagged"}
            </option>
          )}
          <option value="RefreshPosts">{"RefreshPosts"}</option>
        </select>
      )}

      <label className="horizontal-margin" title="options">
        <FontAwesomeIcon
          icon={faGear}
          style={{
            cursor: "pointer",
          }}
          title={"options"}
          className="horizontal-padding"
          onClick={() => {
            setShowPostsOptions(!showPostsOptions)
          }}
        />
      </label>
      {/* refresh posts */}
      <FontAwesomeIcon
        icon={faArrowsRotate}
        id="refresh"
        onClick={() => {
          setRefreshPosts(!refreshPosts)
        }}
        style={{
          cursor: "pointer",
          paddingLeft: "5px",
          paddingRight: "5px",
        }}
      />
    </span>
  )
}
export default BoardOptionForm
