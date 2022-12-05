import { useSearchParams } from "react-router-dom"

export function wrapTags(
  text,
  regex,
  className,
  boardAbbreviation,
  threadKey,
  highlightedPosts,
  setHighlightedPosts,
) {
  const [searchParams] = useSearchParams()
  var postView = searchParams.get("view") || ""

  const textArray = text.split(regex)
  return textArray.map((str) => {
    var parsedPostId = str.replace(">>", "")
    if (regex.test(str)) {
      var outLink = "#" + parsedPostId
      if (boardAbbreviation + "/" + parsedPostId == threadKey) {
        str = str.concat(" (OP)")
      }
      return (
        <a
          href={outLink}
          onClick={() => {
            if (highlightedPosts.includes(parseInt(parsedPostId))) {
              setHighlightedPosts(
                highlightedPosts.filter(function (highlightedPost) {
                  return highlightedPost !== parseInt(parsedPostId)
                }),
              )
            } else {
              setHighlightedPosts([parseInt(parsedPostId)])
            }
          }}
          className={className}
        >
          {str}
        </a>
      )
    }
    return str
  })
}
