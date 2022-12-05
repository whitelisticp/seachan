import React, { useState } from "react"
import { getFile } from "../../../utils/getFile"
import { parseBody } from "../../../utils/parseBody"
import { getFileDetails } from "../../../utils/getFileDetails"
import { isMobile } from "react-device-detect"

const PostBody = ({
  post,
  postView,
  highlightedPosts,
  setHighlightedPosts,
  showAllNsfw,
  onPage,
}) => {
  const [showNsfw, setShowNsfw] = useState(showAllNsfw)
  const [imageExpanded, setImageExpanded] = useState(false)
  const [showMore, setShowMore] = useState(false)
  var maxPostLength = isMobile ? 500 : 1000

  return (
    <div
      style={{
        overflow: "auto",
        justifyContent: "space-between",
        background:
          post.op &&
          onPage == "thread" &&
          highlightedPosts &&
          !highlightedPosts.includes(post.id)
            ? ""
            : highlightedPosts && highlightedPosts.includes(post.id)
            ? "var(--quickreply-color)"
            : "var(--post-bg-color)",
        borderTop:
          (onPage == "board" || (onPage == "thread" && post.op == false)) &&
          "1px solid var(--border-color)",
      }}
    >
      {post.fileName && (
        <>
          {/* horizontal-padding */}
          {getFileDetails(post, showNsfw)}
          {getFile(
            post,
            postView,
            imageExpanded,
            setImageExpanded,
            showNsfw,
            setShowNsfw,
          )}
          {post.subject && isMobile && (
            <span
              style={{
                color: "var(--subject-color)",
                fontWeight: "700",
                paddingLeft: imageExpanded ? "5px" : "0px",
              }}
            >
              {post.subject}
            </span>
          )}
        </>
      )}
      <p
        style={{
          whiteSpace: "pre-wrap",
          paddingLeft: "5px",
          paddingRight: "5px",
        }}
      >
        {parseBody(
          post.body,
          post.boardAbbreviation,
          post.threadKey,
          showMore,
          maxPostLength,
          highlightedPosts,
          setHighlightedPosts,
        )}
        {post.body.length > maxPostLength && (
          <p
            style={{
              textAlign: "center",
              cursor: "pointer",
              marginTop: "10px",
            }}
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Less" : "More"}
          </p>
        )}
      </p>
    </div>
  )
}
export default PostBody