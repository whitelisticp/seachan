export async function highlightAllPostsById(
  posterId,
  posts,
  highlightedPosts,
  setHighlightedPosts,
) {
  if (highlightedPosts.length > 0) {
    setHighlightedPosts([])
  } else {
    highlightedPosts = []
    posts.forEach((post) => {
      if (JSON.stringify(posterId) === JSON.stringify(post.posterId)) {
        highlightedPosts.push(post.id)
      }
    })
    setHighlightedPosts(highlightedPosts)
  }
}
