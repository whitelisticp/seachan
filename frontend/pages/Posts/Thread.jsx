import React, { useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import Posts from "./Posts"
import { getThreadPosts } from "../../utils/getThreadPosts"
import { getBoard } from "../../utils/getBoard"
import { allowedThroughGate } from "../../utils/allowedThroughGate"
import { compareValues } from "../../utils/compareValues"
import { getActor } from "../../utils/getActor"
import { useNavigate } from "react-router-dom"
import ThreadHeader from "./ThreadHeader"
import QuickReply from "./QuickReply"

function Thread({
  actor,
  setActor,
  board,
  setBoard,
  setListedBoards,
  user,
  setUser,
}) {
  const { boardParam, threadParam } = useParams()

  const [posts, setPosts] = useState([])
  const [refreshPosts, setRefreshPosts] = useState(false)
  const [showCreatePostForm, setShowCreatePostForm] = useState(false)
  const [showQuickReplyForm, setShowQuickReplyForm] = useState(false)
  const [replyingTo, setReplyingTo] = useState(null)
  const [minimizeQuickReplyForm, setMinimizeQuickReplyForm] = useState(false)
  const [showAllNsfw, setShowAllNsfw] = useState(user ? user?.showNsfw : false)
  const [showAllFlagged, setShowAllFlagged] = useState(
    user ? user?.showFlagged : false,
  )
  const [postsLoading, setPostsLoading] = useState()
  const [sortDesc, setSortDesc] = useState("desc")
  const [sortBy, setSortBy] = useState("latestActivityTimeStamp")
  const [highlightedPosts, setHighlightedPosts] = useState([])

  let navigate = useNavigate()

  const [searchParams] = useSearchParams()
  var postView = searchParams.get("view") || "paged"

  var onPage = threadParam == null ? "board" : "thread"

  useEffect(() => {
    setPosts([])
    setPostsLoading(true)
    getActor(actor, setActor).then((fetchedActor) => {
      getBoard(fetchedActor, board, boardParam).then((fetchedBoard) => {
        if (fetchedBoard === null || !allowedThroughGate(user, fetchedBoard)) {
          navigate("/")
        }
        setBoard(fetchedBoard)
        getThreadPosts(fetchedActor, boardParam, threadParam).then(
          (threadPosts) => {
            setPosts(threadPosts.sort(compareValues("id", "asc")))
            setPostsLoading(false)
          },
        )
      })
    })
  }, [refreshPosts, boardParam, threadParam]) //user

  return (
    <div style={{ maxWidth: "98%", margin: "auto" }}>
      <ThreadHeader
        user={user}
        actor={actor}
        abbreviation={boardParam}
        threadId={threadParam}
        board={board}
        posts={posts}
        setBoard={setBoard}
        setPosts={setPosts}
        refreshPosts={refreshPosts}
        sortDesc={sortDesc}
        setSortDesc={setSortDesc}
        sortBy={sortBy}
        setSortBy={setSortBy}
        setRefreshPosts={setRefreshPosts}
        setShowCreatePostForm={setShowCreatePostForm}
        showCreatePostForm={showCreatePostForm}
        showAllNsfw={showAllNsfw}
        setShowAllNsfw={setShowAllNsfw}
        showAllFlagged={showAllFlagged}
        setShowAllFlagged={setShowAllFlagged}
        setListedBoards={setListedBoards}
        setShowQuickReplyForm={setShowQuickReplyForm}
        onPage={onPage}
        postView={postView}
      />
      {/* post list */}
      {
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
          postsLoading={postsLoading}
          postView={postView}
          highlightedPosts={highlightedPosts}
          setHighlightedPosts={setHighlightedPosts}
          onPage={onPage}
        />
      }
      <QuickReply
        actor={actor}
        board={board}
        abbreviation={boardParam}
        user={user}
        setListedBoards={setListedBoards}
        threadId={threadParam}
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
    </div>
  )
}
export default Thread
