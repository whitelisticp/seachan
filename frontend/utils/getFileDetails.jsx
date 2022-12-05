import { humanFileSize } from "./humanFileSize"

export function getFileDetails(post, showNsfw) {
  if (!post.fileNsfw || showNsfw) {
    return (
      <>
        <span>
          <span
            style={{
              paddingLeft: "5px",
              paddingRight: "5px",
            }}
          >
            {post.fileName?.substring(0, 30)}
            {post.fileName?.length > 30 && "..." + post.fileExtension}
          </span>
          <span
            style={{
              paddingLeft: "5px",
              paddingRight: "5px",
            }}
          >
            ({humanFileSize(Number(post.fileSize))})
          </span>
          <a
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "underline",
              paddingLeft: "5px",
              paddingRight: "5px",
            }}
            href={post.filePath}
          >
            link
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "underline",
              paddingLeft: "5px",
              paddingRight: "5px",
            }}
            href={"https://iqdb.org/?url=" + post.filePath}
          >
            iqdb
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "underline",
              paddingLeft: "5px",
              paddingRight: "5px",
            }}
            href={"https://trace.moe/?auto&url=" + post.filePath}
          >
            wait
          </a>
        </span>
        <br />
      </>
    )
  }
}
