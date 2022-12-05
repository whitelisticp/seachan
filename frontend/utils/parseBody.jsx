import { wrapTags } from "./wrapTags"

export function parseBody(
  postBody,
  boardAbbreviation,
  threadKey,
  showMore,
  maxPostLength,
  highlightedPosts,
  setHighlightedPosts,
) {
  let greenTextPattern = /^>[^>]/ // >greentext
  let quotePattern = /(>>[0-9]+)/g // >>0

  let postBodyTruncated =
    postBody.length > maxPostLength
      ? showMore
        ? postBody
        : postBody.substring(0, maxPostLength) + "..."
      : postBody

  let output = postBodyTruncated.split("\n").map((line) => {
    if (greenTextPattern.exec(line)) {
      return <span className="green-text">{line}</span>
    } else if (quotePattern.exec(line)) {
      return wrapTags(
        line,
        quotePattern,
        "quoteLink",
        boardAbbreviation,
        threadKey,
        highlightedPosts,
        setHighlightedPosts,
      )
    } else {
      return <>{line}</>
    }
  })
  return jsxJoin(output, "\n")
}

function jsxJoin(array, str) {
  return array.length > 0
    ? array.reduce((result, item) => (
        <>
          {result}
          {str}
          {item}
        </>
      ))
    : null
}
