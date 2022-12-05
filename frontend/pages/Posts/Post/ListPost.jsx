import React, { useEffect } from "react"
import { parseBody } from "../../../utils/parseBody"
import { timeSince } from "../../../utils/timeSince"
import { Link } from "react-router-dom"
import { PosterId } from "./HeaderComponents/PosterId"

const ListPost = ({
  postIn,
  highlightedPosts,
  setHighlightedPosts,
  onPage,
  posts,
  postView,
  showAllFlagged
}) => {
  useEffect(() => {}, [highlightedPosts])
  if (!postIn.flagged || showAllFlagged) {
    return (
      <tr key={postIn.id}>
        <td
          style={{
            border: "1px solid var(--border-color)",
            background:
              highlightedPosts && highlightedPosts.includes(postIn.id)
                ? "var(--quickreply-color)"
                : "var(--post-bg-color)",
          }}
        >
          <Link to={"/" + postIn.boardAbbreviation + "/thread/" + postIn.id}>
            {postIn.id}
          </Link>
        </td>
        <td
          style={{
            border: "1px solid var(--border-color)",
            background:
              highlightedPosts && highlightedPosts.includes(postIn.id)
                ? "var(--quickreply-color)"
                : "var(--post-bg-color)",
          }}
        >
          <PosterId
            post={postIn}
            posts={posts}
            highlightedPosts={highlightedPosts}
            setHighlightedPosts={setHighlightedPosts}
            onPage={onPage}
            postView={postView}
          />
        </td>
        <td
          style={{
            wordBreak: "break-word",
            background:
              highlightedPosts && highlightedPosts.includes(postIn.id)
                ? "var(--quickreply-color)"
                : "var(--post-bg-color)",
            border: "1px solid var(--border-color)",
          }}
        >
          {postIn.subject != "" && (
            <Link to={"/" + postIn.boardAbbreviation + "/thread/" + postIn.id}>
              <span
                style={{
                  color: "var(--subject-color)",
                  fontWeight: "700",
                }}
              >
                {postIn.subject + " "}
              </span>
            </Link>
          )}
          {postIn.body != "" && (
            <span>
              {parseBody(
                postIn.body,
                postIn.boardAbbreviation,
                postIn.threadKey,
                true,
                0,
                highlightedPosts,
                setHighlightedPosts,
              )}
            </span>
          )}
        </td>
        {
          <td
            style={{
              width: "10%",
              background:
                highlightedPosts && highlightedPosts.includes(postIn.id)
                  ? "var(--quickreply-color)"
                  : "var(--post-bg-color)",
              border: "1px solid var(--border-color)",
            }}
          >
            {timeSince(postIn.timeStamp) + " ago"}
          </td>
        }
        {onPage == "board" && (
          <td
            style={{
              width: "auto",
              background:
                highlightedPosts && highlightedPosts.includes(postIn.id)
                  ? "var(--quickreply-color)"
                  : "var(--post-bg-color)",
              border: "1px solid var(--border-color)",
            }}
          >
            {postIn.replyCount}
          </td>
        )}
      </tr>
    )
  }
}
export default ListPost
