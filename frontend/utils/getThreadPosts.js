export async function getThreadPosts(actor, boardParam, threadId) {
  return await actor.getThread(boardParam, threadId).then((threadPosts) => {
    return threadPosts
  })
}
