import React, { useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { getBoard } from "../../utils/getBoard"
import { getThreads } from "../../utils/getThreads"
import { allowedThroughGate } from "../../utils/allowedThroughGate"
import { getActor } from "../../utils/getActor"
import { useNavigate } from "react-router-dom"
import BoardHeader from "./BoardHeader"
import QuickReply from "./QuickReply"
import BoardPagination from "./BoardPagination"
import Posts from "./Posts"
import { POSTS_PER_PAGE } from "../../constants"

function Board({
  actor,
  setActor,
  user,
  setUser,
  board,
  setBoard,
  setListedBoards,
}) {
  const { boardParam, threadParam, pageParam } = useParams()
  var onPage = threadParam == null ? "board" : "thread"

  const pageNumber = pageParam === undefined ? 1 : parseInt(pageParam)

  const [searchParams] = useSearchParams()
  var postView = searchParams.get("view") || "paged"

  // pagination
  const [recordsPerPage] = useState(POSTS_PER_PAGE)
  const [currentPage, setCurrentPage] = useState(pageNumber)
  const [totalPages, setTotalPages] = useState(0)
  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage

  const [posts, setPosts] = useState([])
  const [allPosts, setAllPosts] = useState([])
  const [threadCount, setThreadCount] = useState(0)
  const [refreshPosts, setRefreshPosts] = useState(false)
  const [showAllNsfw, setShowAllNsfw] = useState(user ? user?.showNsfw : false)
  const [showAllFlagged, setShowAllFlagged] = useState(
    user?.showFlagged || false,
  )
  const [showCreatePostForm, setShowCreatePostForm] = useState(false)
  const [showQuickReplyForm, setShowQuickReplyForm] = useState(false)
  const [replyingTo, setReplyingTo] = useState(null)
  const [minimizeQuickReplyForm, setMinimizeQuickReplyForm] = useState(false)
  const [sortDesc, setSortDesc] = useState("desc")
  const [sortBy, setSortBy] = useState("latestActivityTimeStamp")

  const [postsLoading, setPostsLoading] = useState()

  let navigate = useNavigate()

  useEffect(() => {
    if (user) {
      setShowAllFlagged(user.showFlagged)
    }
  }, [user])

  useEffect(() => {
    setPosts([])
    setPostsLoading(true)
    getActor(actor, setActor).then((fetchedActor) => {
      getBoard(fetchedActor, board, boardParam, navigate, user).then(
        (fetchedBoard) => {
          if (!fetchedBoard || !allowedThroughGate(user, fetchedBoard)) {
            navigate("/")
          }
          setBoard(fetchedBoard)
          getThreads(fetchedActor, boardParam, sortDesc, sortBy, user).then(
            (allThreads) => {
              setAllPosts(allThreads)
              setThreadCount(allThreads.length)
              if (postView == "catalog" || postView == "list") {
                setPosts(allThreads)
                setTotalPages(1)
              } else {
                const currentThreads = allThreads.slice(
                  indexOfFirstRecord,
                  indexOfLastRecord,
                )
                setPosts(currentThreads)
                setTotalPages(Math.ceil(allThreads.length / recordsPerPage))
              }
              setPostsLoading(false)
            },
          )
        },
      )
    })
  }, [boardParam, refreshPosts, currentPage, postView, sortDesc, sortBy]) //user

  return (
    <div style={{ maxWidth: "98%", margin: "auto" }}>
      <BoardHeader
        abbreviation={boardParam}
        board={board}
        user={user}
        actor={actor}
        posts={allPosts}
        allPostCount={threadCount}
        setPosts={setPosts}
        refreshPosts={refreshPosts}
        setRefreshPosts={setRefreshPosts}
        showAllNsfw={showAllNsfw}
        setShowAllNsfw={setShowAllNsfw}
        showAllFlagged={showAllFlagged}
        setShowAllFlagged={setShowAllFlagged}
        postView={postView}
        showCreatePostForm={showCreatePostForm}
        setShowCreatePostForm={setShowCreatePostForm}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        sortDesc={sortDesc}
        setSortDesc={setSortDesc}
        sortBy={sortBy}
        setSortBy={setSortBy}
        boardParam={boardParam}
        threadParam={threadParam}
        onPage={onPage}
      />

      {/* post list */}
      <Posts
        actor={actor}
        user={user}
        setUser={setUser}
        posts={posts}
        board={board}
        setBoard={setBoard}
        refreshPosts={refreshPosts}
        setRefreshPosts={setRefreshPosts}
        setReplyingTo={setReplyingTo}
        setMinimizeQuickReplyForm={setMinimizeQuickReplyForm}
        setShowQuickReplyForm={setShowQuickReplyForm}
        showAllNsfw={showAllNsfw}
        showAllFlagged={showAllFlagged}
        postsLoading={postsLoading}
        postView={postView}
        onPage={onPage}
      />

      <QuickReply
        actor={actor}
        board={board}
        abbreviation={boardParam}
        user={user}
        setListedBoards={setListedBoards}
        setRefreshPosts={setRefreshPosts}
        createType="reply"
        isEditPost={false}
        showQuickReplyForm={showQuickReplyForm}
        setShowQuickReplyForm={setShowQuickReplyForm}
        replyingTo={replyingTo}
        setReplyingTo={setReplyingTo}
        setShowCreatePostForm={setShowCreatePostForm}
        minimizeQuickReplyForm={minimizeQuickReplyForm}
        setMinimizeQuickReplyForm={setMinimizeQuickReplyForm}
      />
      {!postsLoading && (
        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            justifyContent: "center",
            listStyle: "none",
          }}
        >
          {totalPages > 1 && (
            <BoardPagination
              nPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              boardAbbreviation={boardParam}
              postView={postView}
            />
          )}
        </div>
      )}
    </div>
  )
}
export default Board
