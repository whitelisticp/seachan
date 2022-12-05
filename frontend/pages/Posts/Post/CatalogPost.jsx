import React, { useState } from "react"
import { Link } from "react-router-dom"
import { parseBody } from "../../../utils/parseBody"
import { getFile } from "../../../utils/getFile"
import { isMobile } from "react-device-detect"

const CatalogPost = ({
  postIn,
  abbreviation,
  postView,
  highlightedPosts,
  setHighlightedPosts,
  showAllNsfw,
  onPage,
  showAllFlagged
}) => {
  const [imageExpanded, setImageExpanded] = useState(false)
  const [showNsfw, setShowNsfw] = useState(showAllNsfw)

  const [post, setPost] = useState(postIn)
  var maxPostLength = isMobile ? 500 : 1000

  if (!post.flagged || showAllFlagged) {
    return (
      <div
        style={{
          maxWidth: isMobile ? "12rem" : "20rem",
          overflowWrap: "break-word",
          textAlign: "center",
        }}
      >
        {/* file */}
        {post.fileName && (
          <>
            {getFile(
              post,
              postView,
              imageExpanded,
              setImageExpanded,
              showNsfw,
              setShowNsfw,
            )}
          </>
        )}
        {/* body */}
        <div
          style={{
            maxHeight: "12rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {onPage == "board" && (
            <Link
              to={"/" + abbreviation + "/thread/" + post.id}
              user={post.user}
            >
              <p title="Posts / Posters / Files" style={{ fontSize: ".75rem" }}>
                {post.replies.length +
                  1 +
                  "/" +
                  post.threadPosterIds.length +
                  "/" +
                  post.fileCount}
              </p>
            </Link>
          )}
          {/* subject */}
          <Link to={"/" + abbreviation + "/thread/" + post.id} user={post.user}>
            {post.subject && (
              <span
                style={{ color: "var(--subject-color)", fontWeight: "700" }}
              >
                {post.subject}
              </span>
            )}
          </Link>
          {/* body */}
          <p>
            {parseBody(
              post.body,
              abbreviation,
              post.threadKey,
              false,
              maxPostLength,
              highlightedPosts,
              setHighlightedPosts,
            )}
          </p>
        </div>
      </div>
    )
  }
}
export default CatalogPost
