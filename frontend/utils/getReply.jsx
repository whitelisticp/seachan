import { Link } from "react-router-dom"
import { isMobile } from "react-device-detect"

export function getReply(post) {
  if (post.op) {
    var postCount = post.replies.length + 1
    var posterCount = post.threadPosterIds.length
    var fileCount = post.fileCount

    return (
      <Link
        style={{ cursor: "pointer" }}
        to={"/" + post?.boardAbbreviation + "/thread/" + post?.id.toString()}
      >
        <span
          title={
            postCount +
            " Post" +
            (postCount != 1 ? "s" : "") +
            " " +
            fileCount +
            " File" +
            (fileCount != 1 ? "s" : "")
          }
          style={{ marginRight: "5px" }}
        >
          {!isMobile ? postCount + " / " + fileCount : postCount}
        </span>
      </Link>
    )
  }
}
