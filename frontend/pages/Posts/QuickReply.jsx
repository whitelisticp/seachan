import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons"
import PostForm from "../../components/form/post/PostForm"

const QuickReply = ({
  actor,
  board,
  abbreviation,
  user,
  setListedBoards,
  threadId,
  setRefreshPosts,
  createType,
  isEditPost,
  showQuickReplyForm,
  setShowQuickReplyForm,
  replyingTo,
  setShowCreatePostForm,
  minimizeQuickReplyForm,
  setMinimizeQuickReplyForm,
}) => {
  const { register, handleSubmit, reset } = useForm()

  function closeQuickreply() {
    setShowQuickReplyForm(!showQuickReplyForm)
    var quickreply = document.getElementById("quickreply")
    quickreply.classList.add("hidden")
  }

  useEffect(() => {}, [replyingTo])

  return (
    <div
      id="quickreply"
      className="hidden"
      style={{
        maxWidth: "85%",
        position: "fixed",
        bottom: "0px",
        right: "0px",
        zIndex: "20",
        border: "1px solid var(--border-color)",
        backgroundColor: "var(--post-header-color)",
      }}
    >
      <p
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border-color)",
          backgroundColor: "var(--post-header-color)",
        }}
      >
        <span>
          {/* minimizes the quick reply box */}
          <FontAwesomeIcon
            icon={minimizeQuickReplyForm ? faPlus : faMinus}
            title="Hide"
            style={{ paddingLeft: "5px", cursor: "pointer" }}
            onClick={() => {
              setMinimizeQuickReplyForm(!minimizeQuickReplyForm)
            }}
          />
        </span>
        <span className="subject horizontal-padding">
          Replying to {abbreviation + "/" + replyingTo}
        </span>
        <span>
          {/* closes the quick reply box */}
          <FontAwesomeIcon
            icon={faXmark}
            style={{
              paddingRight: "5px",
              cursor: "pointer",
              color: "var(--danger-color-light)",
            }}
            onClick={() => closeQuickreply()}
          />
        </span>
      </p>
      {!minimizeQuickReplyForm && (
        <div
          id="quickreply"
          style={{
            padding: ".5em",
            backgroundColor: "var(--quickreply-color)",
          }}
        >
          <PostForm
            actor={actor}
            board={board}
            user={user}
            register={register}
            reset={reset}
            handleSubmit={handleSubmit}
            threadId={threadId}
            createType={createType}
            isQuickreply={true}
            isEditPost={isEditPost}
            setListedBoards={setListedBoards}
            setRefreshPosts={setRefreshPosts}
            replyingTo={replyingTo}
            setShowQuickReplyForm={setShowQuickReplyForm}
            setShowCreatePostForm={setShowCreatePostForm}
          />
        </div>
      )}
    </div>
  )
}
export default QuickReply
