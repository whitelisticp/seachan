
export function getPostCountById(posterId, posts, onPage) {
  var postCount = 0
  if (onPage == "board") {
    return ""
  } else {
    for (let post of Object.values(posts)) {
      if (
        Object.keys(post.posterId)[0] == Object.keys(posterId)[0] &&
        Object.values(post.posterId)[0] == Object.values(posterId)[0]
      ) {
        postCount += 1
      }
    }
  }

  return postCount
}
