import React, { useState } from "react"
import { isMobile } from "react-device-detect"
import { OptionComponent } from "../../../components/form/post/OptionComponent"
import LoadingSpinner from "../../../components/ui/LoadingSpinner"

export const Options = ({
  post,
  setPost,
  user,
  setUser,
  actor,
  minimizePost,
  setMinimizePost,
  setHidePost,
  hidePost,
  showWeb3,
  setShowWeb3,
  showReport,
  setShowReport,
  refreshPosts,
  setRefreshPosts,
  showOptions,
  setShowOptions,
  onPage,
}) => {
  const [isLoading, setLoading] = useState(false)

  return (
    <>
      {/* option mobile */}
      {showOptions && (
        <div
          style={{
            textAlign: "center",
            width: isMobile ? "100%" : "inherit",
            backgroundColor:
              (onPage == "board" || (onPage == "thread" && post.op == false)) &&
              "var(--post-header-color)",
          }}
        >
          <OptionComponent
            actor={actor}
            user={user}
            setUser={setUser}
            post={post}
            setPost={setPost}
            showOptions={showOptions}
            setShowOptions={setShowOptions}
            setMinimizePost={setMinimizePost}
            minimizePost={minimizePost}
            hidePost={hidePost}
            showWeb3={showWeb3}
            setShowWeb3={setShowWeb3}
            setHidePost={setHidePost}
            showReport={showReport}
            setShowReport={setShowReport}
            isLoading={isLoading}
            setLoading={setLoading}
            setRefreshPosts={setRefreshPosts}
            refreshPosts={refreshPosts}
          />
        </div>
      )}
      {isLoading && (
        <span>
          <LoadingSpinner isSmall={true} />
        </span>
      )}
    </>
  )
}
