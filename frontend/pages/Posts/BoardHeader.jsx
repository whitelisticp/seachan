import React from "react"
import BoardPagination from "./BoardPagination"
import PostForm from "../../components/form/post/PostForm"
import BoardOptionForm from "../../components/form/posts/BoardOptionForm"
import { useForm } from "react-hook-form"

const BoardHeader = ({
  abbreviation,
  board,
  user,
  actor,
  posts,
  allPostCount,
  setPosts,
  refreshPosts,
  setRefreshPosts,
  showAllNsfw,
  setShowAllNsfw,
  showAllFlagged,
  setShowAllFlagged,
  postView,
  showCreatePostForm,
  setShowCreatePostForm,
  currentPage,
  setCurrentPage,
  totalPages,
  sortDesc,
  setSortDesc,
  sortBy,
  setSortBy,
  onPage,
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
        <span onClick={() => setCurrentPage(1)}>
          /{abbreviation}/ {board?.name}
        </span>
      </div>

      {/* board stats  */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ flexGrow: "1", flexBasis: "0" }}>
          {/* page number */}
          {totalPages > 1 && (
            <BoardPagination
              nPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              boardAbbreviation={abbreviation}
              postView={postView}
            />
          )}
          {/* board thread count */}
          {allPostCount} {allPostCount == 1 ? "  thread" : " threads"}
        </div>
        {/* create thread button */}
        <div style={{ textAlign: "center", padding: "0px" }}>
          <button
            onClick={() => setShowCreatePostForm(!showCreatePostForm)}
            className="success"
          >
            New Thread
          </button>
        </div>
        {/* board controls */}
        <BoardOptionForm
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
          isEditPost={false}
          refreshPosts={refreshPosts}
          setRefreshPosts={setRefreshPosts}
          setShowCreatePostForm={setShowCreatePostForm}
          setShowQuickReplyForm={false}
          posts={posts}
        />
      )}
    </>
  )
}
export default BoardHeader
