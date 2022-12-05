import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowsRotate, faGear } from "@fortawesome/free-solid-svg-icons"
import SortPostsForm from "./SortPostsForm"
import PostViewForm from "./PostViewForm"
import LoadingSpinner from "../../ui/LoadingSpinner"
import { getThreadPrincipals } from "../../../utils/getThreadPrincipals"
import { isMobile } from "react-device-detect"
import { useParams } from "react-router-dom"

const ThreadOptionForm = ({
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
  var threadContainsNsfw = posts.some((e) => e.fileNSFW === true)
  const [showPostsOptions, setShowPostsOptions] = useState(false)
  const [postsOptionLoading, setPostsOptionLoading] = useState(false)
  const { threadParam } = useParams()
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
        threadId={threadParam}
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
            } else if (e.target.value == "Refresh") {
              setPostsOptionLoading(true)
              setRefreshPosts(!refreshPosts)
              setPostsOptionLoading(false)
              setShowPostsOptions(false)
            } else if (e.target.value == "CopyPrincipals") {
              var threadPrincipals = getThreadPrincipals(posts[0])
              console.log("threadPrincipals", threadPrincipals)
              navigator.clipboard.writeText(threadPrincipals)
              setShowPostsOptions(false)
            }
          }}
        >
          <option value="none" selected disabled hidden>
            Select Option
          </option>
          {threadContainsNsfw && (
            <option value="ToggleAllNSFW">
              {showAllNsfw ? "Hide All NSFW" : "Show All NSFW"}
            </option>
          )}
          <option value="Refresh">Refresh</option>
          <option value="CopyPrincipals">Copy Principals</option>
        </select>
      )}

      {/* nsfw toggle */}
      {/* {threadContainsNsfw && (
            <span
              style={{
                cursor: "pointer",
                color: "var(--text-color)",
                background: "var(--danger-color)",
                padding: "2px",
              }}
              title={showAllNsfw ? "Hide NSFW" : "Show NSFW"}
              onClick={() => {
                setShowAllNsfw(!showAllNsfw)
                setRefreshPosts(!refreshPosts)
              }}
            >
              {showAllNsfw == false ? "Show NSFW" : "Hide NSFW"}
            </span>
          )} */}

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
      {/* </Link> */}
    </span>
  )
}
export default ThreadOptionForm
