import React from "react"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import { useParams } from "react-router-dom"
import Post from "./Post/Post"
import CatalogPost from "./Post/CatalogPost"
import ListPost from "./Post/ListPost"

const Posts = ({
  actor,
  user,
  setUser,
  posts,
  board,
  setBoard,
  refreshPosts,
  setRefreshPosts,
  setReplyingTo,
  setMinimizeQuickReplyForm,
  setShowQuickReplyForm,
  showAllNsfw,
  showAllFlagged,
  postsLoading,
  postView,
  highlightedPosts,
  setHighlightedPosts,
  onPage,
}) => {
  const { boardParam } = useParams()

  return (
    <>
      {/* posts loading */}
      {postsLoading && (
        <span
          style={{
            marginTop: "5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LoadingSpinner isSmall={false} />
        </span>
      )}

      {postView == "catalog" && posts?.length > 0 && (
        <li
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignContent: "space-around",
            justifyContent: "space-evenly",
            gap: ".25rem",
          }}
        >
          {posts?.map((postIn) => {
            return (
              <CatalogPost
                postIn={postIn}
                abbreviation={boardParam}
                postView={postView}
                showAllNsfw={showAllNsfw}
                highlightedPosts={highlightedPosts}
                setHighlightedPosts={setHighlightedPosts}
                onPage={onPage}
                showAllFlagged={showAllFlagged}
              />
            )
          })}
        </li>
      )}

      {postView == "paged" && posts?.length > 0 && (
        <>
          {posts?.map((postIn) => {
            return (
              <Post
                postIn={postIn}
                board={board}
                refreshPosts={refreshPosts}
                setRefreshPosts={setRefreshPosts}
                user={user}
                setUser={setUser}
                postView={postView}
                actor={actor}
                posts={posts}
                setBoard={setBoard}
                setShowQuickReplyForm={setShowQuickReplyForm}
                setReplyingTo={setReplyingTo}
                setMinimizeQuickReplyForm={setMinimizeQuickReplyForm}
                showAllNsfw={showAllNsfw}
                showAllFlagged={showAllFlagged}
                highlightedPosts={highlightedPosts}
                setHighlightedPosts={setHighlightedPosts}
                onPage={onPage}
              />
            )
          })}
        </>
      )}

      {postView == "list" && posts?.length > 0 && (
        <table
          style={{
            textAlign: "center",
            // minWidth: "50%",
            width: "fit-content",
            margin: "auto",
            // color: "var(--text-color)",
            tableLayout: "auto",
          }}
        >
          <thead>
            <tr>
              <th style={{ backgroundColor: "var(--post-header-color)" }}>
                Id
              </th>
              <th style={{ backgroundColor: "var(--post-header-color)" }}>
                Poster
              </th>
              <th style={{ backgroundColor: "var(--post-header-color)" }}>
                Post
              </th>
              {
                <th style={{ backgroundColor: "var(--post-header-color)" }}>
                  Timestamp
                </th>
              }
              {onPage == "board" && (
                <th style={{ backgroundColor: "var(--post-header-color)" }}>
                  Replies
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {posts?.map((postIn) => {
              return (
                <ListPost
                  postIn={postIn}
                  highlightedPosts={highlightedPosts}
                  setHighlightedPosts={setHighlightedPosts}
                  onPage={onPage}
                  posts={posts}
                  postView={postView}
                  showAllFlagged={showAllFlagged}
                />
              )
            })}
          </tbody>
        </table>
      )}
    </>
  )
}
export default Posts
