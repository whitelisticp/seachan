export function getThreadPrincipals(post) {
  var posterIdsFiltered = post.threadPosterIds.filter(
    (posterId) => "Principal" in posterId,
  )

  let posterIds = posterIdsFiltered.map((posterId) => posterId.Principal)

  return posterIds.toString()
}
