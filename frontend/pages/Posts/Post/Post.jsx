import React, { useState, useEffect } from "react"
import PostHeader from "./PostHeader"
import PostBody from "./PostBody"
import { isNotAdmin } from "../../../utils/isNotAdmin"
import { isAdmin } from "../../../utils/isAdmin"

const Post = ({
  postIn,
  user,
  setUser,
  postView,
  actor,
  posts,
  setReplyingTo,
  minimizeQuickReplyForm,
  setMinimizeQuickReplyForm,
  highlightedPosts,
  setHighlightedPosts,
  showAllNsfw,
  showAllFlagged,
  refreshPosts,
  setRefreshPosts,
  onPage,
}) => {
  const [post, setPost] = useState(postIn)
  const [minimizePost, setMinimizePost] = useState(
    user && user.minimizedPosts.includes(post.boardAbbreviation + "/" + post.id)
      ? true
      : false,
  )
  const [hidePost, setHidePost] = useState(
    post.hidden && isNotAdmin(user)
      ? true
      : user &&
        user.hiddenPosts.includes(post.boardAbbreviation + "/" + post.id)
      ? true
      : false,
  )

  const [filensfw, setFileNSFW] = useState(
    post.hidden && isNotAdmin(user)
      ? true
      : user &&
        user.hiddenPosts.includes(post.boardAbbreviation + "/" + post.id)
      ? true
      : false,
  )

  useEffect(() => {
    setMinimizePost(
      user &&
        user.minimizedPosts.includes(post.boardAbbreviation + "/" + post.id)
        ? true
        : hidePost,
    )
  }, [user?.minimizedPosts])

  useEffect(() => {
    setHidePost(
      user && user.hiddenPosts.includes(post.boardAbbreviation + "/" + post.id)
        ? true
        : hidePost,
    )
  }, [user?.hiddenPosts])

  useEffect(() => {
    setFileNSFW(post.fileNSFW ? true : false)
  }, [post?.fileNSFW])

  useEffect(() => {}, [user])
  useEffect(() => {}, [post])
  useEffect(() => {}, [highlightedPosts])

  return (
    <>
      {/* post */}
      {!hidePost && (!post.flagged || showAllFlagged) && (
        <div
          style={{
            flex: "1",
            overflow: "auto",
            border:
              onPage == "board" || (onPage == "thread" && post.op == false)
                ? "1px solid var(--border-color)"
                : "none",
            marginBottom: ".5rem",
          }}
          id={post.id}
        >
          {/* anchor for auto-scrolling to post */}
          <a href={"#" + post.id}></a>
          {/* post header */}
          <PostHeader
            post={post}
            setPost={setPost}
            user={user}
            setUser={setUser}
            actor={actor}
            posts={posts}
            minimizePost={minimizePost}
            setMinimizePost={setMinimizePost}
            setReplyingTo={setReplyingTo}
            setHidePost={setHidePost}
            hidePost={hidePost}
            minimizeQuickReplyForm={minimizeQuickReplyForm}
            setMinimizeQuickReplyForm={setMinimizeQuickReplyForm}
            refreshPosts={refreshPosts}
            setRefreshPosts={setRefreshPosts}
            highlightedPosts={highlightedPosts}
            setHighlightedPosts={setHighlightedPosts}
            onPage={onPage}
            postView={postView}
          />
          {/* post body */}
          {!minimizePost && (!post.flagged || showAllFlagged) && !(isAdmin(user) && post.hidden) && (
            <PostBody
              post={post}
              postView={postView}
              highlightedPosts={highlightedPosts}
              setHighlightedPosts={setHighlightedPosts}
              showAllNsfw={showAllNsfw}
              onPage={onPage}
            />
          )}
        </div>
      )}
    </>
  )
}
export default Post
