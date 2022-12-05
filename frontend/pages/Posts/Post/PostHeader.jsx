import React, { useState } from "react"
import { isMobile } from "react-device-detect"
import { Options } from "./Options"
import { Subject } from "./HeaderComponents/Subject"
import { PosterId } from "./HeaderComponents/PosterId"
import { TimeStamp } from "./HeaderComponents/TimeStamp"
import { PostId } from "./HeaderComponents/PostId"
import { Stickied } from "./HeaderComponents/Stickied"
import { Locked } from "./HeaderComponents/Locked"
import { Hidden } from "./HeaderComponents/Hidden"
import { Saged } from "./HeaderComponents/Saged"
import { Flagged } from "./HeaderComponents/Flagged"
import { Web3Toggle } from "./HeaderComponents/Web3Toggle"
import { OptionsToggle } from "./HeaderComponents/OptionsToggle"
import { Watched } from "./HeaderComponents/Watched"
import { getReply } from "../../../utils/getReply"
import { Web3 } from "./Web3"
import { ReportComponent } from "../../../components/form/post/ReportComponent"

const PostHeader = ({
  post,
  setPost,
  user,
  setUser,
  actor,
  posts,
  minimizePost,
  setMinimizePost,
  setReplyingTo,
  hidePost,
  setHidePost,
  minimizeQuickReplyForm,
  setMinimizeQuickReplyForm,
  refreshPosts,
  setRefreshPosts,
  highlightedPosts,
  setHighlightedPosts,
  onPage,
  postView,
}) => {
  const [showWeb3, setShowWeb3] = useState(false)
  const [showTag, setShowTag] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  return (
    <>
      {/* post header */}
      <p
        style={{
          paddingLeft: ".3rem",
          paddingRight: ".3rem",
          display: "flex",
          justifyContent: "space-between",
          backgroundColor:
            (onPage == "board" || (onPage == "thread" && post.op == false)) &&
            "var(--post-header-color)",
        }}
      >
        <span
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: ".3rem",
          }}
        >
          {/* watched thread icon*/}
          <Watched post={post} user={user} />
          {/* non-mobile subject*/}
          {!isMobile && <Subject subject={post.subject} />}
          {/* poster id */}
          <PosterId
            post={post}
            posts={posts}
            highlightedPosts={highlightedPosts}
            setHighlightedPosts={setHighlightedPosts}
            onPage={onPage}
            postView={postView}
          />
          {/* time stamp */}
          <TimeStamp timeStamp={post.timeStamp} />
          {/* post id */}
          <PostId
            post={post}
            minimizeQuickReplyForm={minimizeQuickReplyForm}
            setMinimizeQuickReplyForm={setMinimizeQuickReplyForm}
            setReplyingTo={setReplyingTo}
          />
          {/* stickied */}
          <Stickied post={post} />
          {/* locked */}
          <Locked post={post} />
          {/* hidden */}
          <Hidden post={post} />
          {/* saged */}
          <Saged post={post} />
          {/* flagged */}
          <Flagged post={post} />
          {/* web3 toggle */}
          <Web3Toggle
            post={post}
            user={user}
            showWeb3={showWeb3}
            setShowWeb3={setShowWeb3}
            setShowOptions={setShowOptions}
            setShowTag={setShowTag}
            setShowReport={setShowReport}
          />
          {/* options */}
          <OptionsToggle
            setShowOptions={setShowOptions}
            showOptions={showOptions}
            setShowWeb3={setShowWeb3}
            setShowTag={setShowTag}
            setShowReport={setShowReport}
          />
          {!isMobile && (
            <Options
              post={post}
              setPost={setPost}
              user={user}
              setUser={setUser}
              actor={actor}
              minimizePost={minimizePost}
              setMinimizePost={setMinimizePost}
              hidePost={hidePost}
              setHidePost={setHidePost}
              showWeb3={showWeb3}
              setShowWeb3={setShowWeb3}
              showTag={showTag}
              setShowTag={setShowTag}
              showReport={showReport}
              setShowReport={setShowReport}
              refreshPosts={refreshPosts}
              setRefreshPosts={setRefreshPosts}
              showOptions={showOptions}
              setShowOptions={setShowOptions}
              onPage={onPage}
            />
          )}
        </span>
        <span>
          {/* web3 */}
          {showWeb3 && !isMobile && (
            <Web3
              actor={actor}
              post={post}
              showWeb3={showWeb3}
              onPage={onPage}
            />
          )}
          {/* report */}
          {showReport && !isMobile && (
            <ReportComponent
              actor={actor}
              post={post}
              setPost={setPost}
              showReport={showReport}
              setShowReport={setShowReport}
              onPage={onPage}
            />
          )}
        </span>
        {/* reply */}
        <span>{getReply(post)}</span>
      </p>

      {/* post operations */}
      {isMobile && (
        <Options
          post={post}
          setPost={setPost}
          user={user}
          setUser={setUser}
          actor={actor}
          minimizePost={minimizePost}
          setMinimizePost={setMinimizePost}
          hidePost={hidePost}
          setHidePost={setHidePost}
          showWeb3={showWeb3}
          setShowWeb3={setShowWeb3}
          showTag={showTag}
          setShowTag={setShowTag}
          showReport={showReport}
          setShowReport={setShowReport}
          refreshPosts={refreshPosts}
          setRefreshPosts={setRefreshPosts}
          showOptions={showOptions}
          setShowOptions={setShowOptions}
          onPage={onPage}
        />
      )}
      <span>
        {/* web3 */}
        {showWeb3 && isMobile && (
          <Web3 actor={actor} post={post} showWeb3={showWeb3} onPage={onPage} />
        )}
        {showReport && isMobile && (
          <ReportComponent
            actor={actor}
            post={post}
            setPost={setPost}
            showReport={showReport}
            setShowReport={setShowReport}
            onPage={onPage}
          />
        )}
      </span>
    </>
  )
}
export default PostHeader
