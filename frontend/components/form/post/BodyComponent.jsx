export const BodyComponent = function ({ register, isQuickreply }) {
    return (
      <>
        <label>Body</label>
        <textarea
          type="text"
          name="body"
          id={isQuickreply ? "quickreply-textarea" : "reply-textarea"}
          style={{ height: "8em", padding: "5px", resize: "both" }}
          {...register("body")}
        />
      </>
    )
  }