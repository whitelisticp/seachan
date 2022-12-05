import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faVolumeHigh, faBook } from "@fortawesome/free-solid-svg-icons"
import { isMobile } from "react-device-detect"

export function getFile(
  post,
  postView,
  imageExpanded,
  setImageExpanded,
  showNsfw,
  setShowNsfw,
) {
  var link = "/" + post.boardAbbreviation + "/thread/" + post.id
  if (!post.fileNsfw || showNsfw) {
    if (postView == "paged") {
      if (post.fileType == "audio") {
        return (
          <a target="_blank" href={post.filePath}>
            <FontAwesomeIcon icon={faVolumeHigh} className="fa-10x fa-fw" />
          </a>
        )
      } else if (post.fileType == "image") {
        return (
          <img
            onClick={() => setImageExpanded(!imageExpanded)}
            style={
              imageExpanded
                ? {
                    float: "left",
                    width: "100%",
                    marginBottom: "10px",
                    cursor: "pointer",
                  }
                : {
                    float: "left",
                    width: isMobile ? "10rem" : "25rem",
                    marginRight: "10px",
                    maxHeight: "40rem",
                    cursor: "pointer",
                  }
            }
            src={post.filePath}
          />
        )
      } else if (post.fileType == "pdf") {
        return (
          <a target="_blank" href={post.filePath}>
            <FontAwesomeIcon icon={faBook} className="fa-10x fa-fw" />
          </a>
        )
      } else if (post.fileType == "video") {
        return (
          <video
            controls
            type="video"
            src={post.filePath}
            style={{
              marginRight: "10px",
              width: isMobile ? "10rem" : "25rem",
              float: "left",
            }}
          />
        )
      } else if (post.fileType == "zip") {
        return (
          <a target="_blank" href={post.filePath}>
            <FontAwesomeIcon icon={faFileZipper} className="fa-10x fa-fw" />
          </a>
        )
      }
    } else if (postView == "catalog") {
      if (post.fileType == "audio") {
        return (
          <Link to={link} user={post.user}>
            <FontAwesomeIcon icon={faVolumeHigh} className="fa-10x fa-fw" />
          </Link>
        )
      } else if (post.fileType == "image") {
        return (
          <Link to={link} user={post.user}>
            <img
              style={{
                maxHeight: "10rem",
                cursor: "pointer",
                maxWidth: isMobile ? "12rem" : "20rem",
              }}
              src={post.filePath}
            />
          </Link>
        )
      } else if (post.fileType == "pdf") {
        return (
          <Link to={link} user={post.user}>
            <FontAwesomeIcon icon={faBook} className="fa-10x fa-fw" />
          </Link>
        )
      } else if (post.fileType == "video") {
        return (
          <Link to={link} user={post.user}>
            <video
              controls
              type="video"
              src={post.filePath}
              style={{
                height: "10rem",
                marginRight: "10px",
                maxWidth: isMobile ? "12rem" : "20rem",
              }}
            />
          </Link>
        )
      } else if (post.fileType == "zip") {
        return (
          <a target="_blank" href={post.filePath}>
            <FontAwesomeIcon icon={faFileZipper} className="fa-10x fa-fw" />
          </a>
        )
      }
    }
  } else {
    return (
      <span
        onClick={() => setShowNsfw(!showNsfw)}
        style={{
          padding: "2px",
          margin: "5px",
          cursor: "pointer",
          color: "var(--text-color)",
          background: "var(--danger-color)",
        }}
      >
        Show NSFW
      </span>
    )
  }
}
