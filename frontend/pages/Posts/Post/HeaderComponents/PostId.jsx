import { showAndQuoteQuickReply } from "../../../../utils/showAndQuoteQuickReply"

export const PostId = function ({
  post,
  minimizeQuickReplyForm,
  setMinimizeQuickReplyForm,
  setReplyingTo,
}) {
  return !post.isLocked && !post.flagged ? (
    <a
      onClick={() => {
        showAndQuoteQuickReply(
          post?.id,
          minimizeQuickReplyForm,
          setMinimizeQuickReplyForm,
        )
        setReplyingTo(post?.id)
      }}
    >
      <span
        className="horizontal-padding"
        style={{ textDecoration: "underline", cursor: "pointer" }}
      >
        #{post.id}
      </span>
    </a>
  ) : (
    <span className="horizontal-padding">#{post.id}</span>
  )
}
