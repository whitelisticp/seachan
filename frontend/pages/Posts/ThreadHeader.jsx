import React from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import ThreadOptionForm from "../../components/form/posts/ThreadOptionForm"
import PostForm from "../../components/form/post/PostForm"

const ThreadHeader = ({
  abbreviation,
  threadId,
  board,
  user,
  actor,
  posts,
  setPosts,
  refreshPosts,
  sortDesc,
  setSortDesc,
  sortBy,
  setSortBy,
  setRefreshPosts,
  setShowCreatePostForm,
  showCreatePostForm,
  showAllNsfw,
  setShowAllNsfw,
  showAllFlagged,
  setShowAllFlagged,
  setListedBoards,
  setShowQuickReplyForm,
  onPage,
  postView,
}) => {
  const { register, handleSubmit, reset } = useForm()

  return (
    <>
      {/* board name  */}
      <div
        style={{
          cursor: "pointer",
          fontSize: "2em",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Link to={"/" + abbreviation}>
          /{abbreviation}/ {board?.name} #{threadId}
        </Link>
      </div>
      {/* thread stats  */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        {/* board name  */}
        <div style={{ flexGrow: "1", flexBasis: "0" }}>
          {/* reply count */}
          {posts?.length} {posts?.length == 1 ? " reply / " : " replies / "}
          {/* poster count */}
          {posts[0]?.threadPosterIds.length}
          {posts[0]?.threadPosterIds.length == 1 ? " poster / " : " posters / "}
          {/* file count */}
          {posts[0]?.fileCount}
          {posts[0]?.fileCount == 1 ? " file" : " files"}
        </div>
        {/* create reply button */}
        <div style={{ textAlign: "center", padding: "0px" }}>
          <button
            onClick={() => setShowCreatePostForm(!showCreatePostForm)}
            className="success"
          >
            Reply
          </button>
        </div>

        {/* board controls */}
        <ThreadOptionForm
          abbreviation={abbreviation}
          user={user}
          posts={posts}
          setPosts={setPosts}
          refreshPosts={refreshPosts}
          setRefreshPosts={setRefreshPosts}
          showAllNsfw={showAllNsfw}
          setShowAllNsfw={setShowAllNsfw}
          showAllFlagged={showAllFlagged}
          setShowAllFlagged={setShowAllFlagged}
          postView={postView}
          sortDesc={sortDesc}
          setSortDesc={setSortDesc}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onPage={onPage}
        />
      </div>
      {/* create post button*/}
      {showCreatePostForm && (
        <PostForm
          board={board}
          user={user}
          actor={actor}
          register={register}
          handleSubmit={handleSubmit}
          reset={reset}
          threadId={threadId}
          createType="reply"
          isEditPost={false}
          setListedBoards={setListedBoards}
          setRefreshPosts={setRefreshPosts}
          setShowCreatePostForm={setShowCreatePostForm}
          setShowQuickReplyForm={setShowQuickReplyForm}
          posts={posts}
        />
      )}
    </>
  )
}
export default ThreadHeader
