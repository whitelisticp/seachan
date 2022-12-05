import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import { isMobile } from "react-device-detect"
import LoadingSpinner from "../../ui/LoadingSpinner"
import { UsernameComponent } from "./UsernameComponent"
import { IcpBalanceComponent } from "./IcpBalanceComponent"
import { SubjectComponent } from "./SubjectComponent"
import { BodyComponent } from "./BodyComponent"
import { FileInputComponent } from "./FileInputComponent"
import { StickiedComponent } from "./StickiedComponent"
import { LockedComponent } from "./LockedComponent"
import { AcceptTipsComponent } from "./AcceptTipsComponent"
import { SagedComponent } from "./SagedComponent"
import { web3StorageUploadFile } from "../../../utils/web3StorageUploadFile"
import { findMentions } from "../../../utils/findMentions"
import { stringToColor } from "../../../utils/stringToColor"
import { getFileType } from "../../../utils/getFileType"
import { refreshBoardList } from "../../../utils/refreshBoardList"
import { isAdmin } from "../../../utils/isAdmin"
import { allowedToPost } from "../../../utils/allowedToPost"
import { generateAnonId } from "../../../utils/generateAnonId"
import { getAnonId } from "../../../utils/getAnonId"

const PostForm = ({
  board,
  post,
  user,
  actor,
  register,
  handleSubmit,
  reset,
  threadId,
  createType,
  isQuickreply,
  isEditPost,
  setListedBoards,
  refreshPosts,
  setRefreshPosts,
  setShowCreatePostForm,
  replyingTo,
  setShowQuickReplyForm,
  posts,
}) => {
  const { boardParam, threadParam, pageParam } = useParams()
  const anonId = getAnonId()

  var onPage = threadParam === undefined ? "board" : "thread"
  var createType = onPage == "board" && replyingTo == null ? "thread" : "reply"

  let navigate = useNavigate()
  const [stickiedChecked, setStickiedChecked] = useState(false)
  const [lockedChecked, setLockedChecked] = useState(false)
  // const [displayPrincipalChecked, setDisplayPrincipalChecked] = useState(false);
  const [acceptTipsChecked, setAcceptTipsChecked] = useState(false)
  const [displayIcpBalanceChecked, setDisplayIcpBalanceChecked] =
    useState(false)
  const [sagedChecked, setSagedChecked] = useState(false)
  const [fileNsfwChecked, setFileNsfwChecked] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (data) => {
    setSubmitting(true)

    if (data.file.length == 0 && data.body == "") {
      alert("post must have a file, text, or both")
      setSubmitting(false)
      return
    }

    var posterId = {},
      icpBalance = 0.0,
      posterIdColor = "#FFFFFF",
      filePath = "",
      fileType = "",
      fileExtension = "",
      fileName = "",
      fileSize = 0,
      stickied = false,
      locked = false,
      displayIcpBalance = false,
      acceptTips = false
    if (createType == "thread") {
      var threadIdParsed = await actor.getNextPostId(board.abbreviation)
    } else if (createType == "reply") {
      var threadIdParsed = threadId || replyingTo
    }
    const threadKey = board.abbreviation + "/" + threadIdParsed.toString()
    displayIcpBalance = data.displayIcpBalance === "true"
    acceptTips = data.acceptTips === "true"

    if (JSON.parse(data.userName).type == "anonymous") {
      posterId = {
        ["Anon"]: generateAnonId(anonId + threadKey.replace("/", "")),
      }
      posterIdColor = stringToColor(
        Object.values(posterId)[0],
        threadKey.replace("/", ""),
      )
    }
    if (JSON.parse(data.userName).type == "principal") {
      posterId = { ["Principal"]: JSON.parse(data.userName).value }
      posterIdColor = stringToColor(
        Object.values(posterId)[0],
        threadKey.replace("/", ""),
      )
    }
    if (JSON.parse(data.userName).type == "userName") {
      posterId = { ["UserName"]: JSON.parse(data.userName).value }
      posterIdColor = stringToColor(
        Object.values(posterId)[0],
        threadKey.replace("/", ""),
      )
    }

    var stickied = data.stickied === "true" && createType == "thread"
    var locked = data.locked === "true" && createType == "thread"
    var saged = sagedChecked
    var fileNsfw = data.fileNsfw === "true"
    var body = data.body.replace(/^\s+|\s+$/g, "") // trim line breaks from start and end of string
    var subject = data.subject || ""
    if (displayIcpBalance) {
      icpBalance = parseFloat(user.icpBalance)
    }

    if (data.file && data.file[0]) {
      filePath = await web3StorageUploadFile(data)
      fileName = data.file[0].name
      fileExtension = fileName.split(".").pop().toLowerCase()
      fileType = getFileType(fileExtension)
      fileSize = data.file[0].size
    }

    var mentions = findMentions(body, board.abbreviation)
    const newPost = {
      boardAbbreviation: board.abbreviation,
      posterId: posterId,
      siteAnonId: anonId,
      threadAnonId: generateAnonId(anonId + threadKey.replace("/", "")),
      acceptTips: acceptTips,
      icpBalance: icpBalance,
      subject: subject,
      body: body,
      posterIdColor: posterIdColor,
      mentions: mentions,
      stickied: stickied,
      locked: locked,
      saged: saged,
      filePath: filePath,
      fileNsfw: fileNsfw,
      fileType: fileType,
      fileName: fileName,
      fileExtension: fileExtension,
      fileSize: fileSize,
    }

    if (createType == "thread") {
      actor.createThread(newPost).then((createdPost) => {
        if (createdPost["ok"]) {
          refreshBoardList(setListedBoards)
          let url =
            "/" +
            createdPost["ok"].boardAbbreviation +
            "/thread/" +
            createdPost["ok"].id.toString()
          setSubmitting(false)
          navigate(url)
        } else {
          alert(createdPost["err"])
        }
      })
    } else if (createType == "reply") {
      actor
        .createReply(threadKey, newPost)
        .then((createdPost) => {
          if (createdPost["ok"]) {
            refreshBoardList(setListedBoards)
            reset()
            if (isQuickreply) {
              setSubmitting(false)
              var quickreply = document.getElementById("quickreply")
              quickreply.classList.add("hidden")
            }
            if (!threadId) {
              let url =
                "/" + createdPost["ok"].threadKey.split("/").join("/thread/")
              setSubmitting(false)
              navigate(url)
            } else {
              setRefreshPosts(!refreshPosts)
              setShowCreatePostForm(false)
            }
          } else {
            alert(createdPost["err"])
          }
        })
        .catch((err) => {
          alert(err)
        })
    }
  }
  return (
    <div
      style={{
        margin: "auto",
        width: isMobile || isQuickreply ? "98%" : "50%",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        style={{ padding: ".25em", marginTop: ".5em", marginBottom: "10px" }}
      >
        <div style={{ margin: "auto", display: "grid", textAlign: "left" }}>
          {/* username */}
          <UsernameComponent
            register={register}
            user={user}
            board={board}
            isEditPost={isEditPost}
            post={post}
          />
          {/* accept tips */}
          <AcceptTipsComponent
            register={register}
            user={user}
            board={board}
            acceptTipsChecked={acceptTipsChecked}
            setAcceptTipsChecked={setAcceptTipsChecked}
          />
          {/* display ICP balance */}
          <IcpBalanceComponent
            register={register}
            user={user}
            board={board}
            displayIcpBalanceChecked={displayIcpBalanceChecked}
            setDisplayIcpBalanceChecked={setDisplayIcpBalanceChecked}
          />
          {/* saged */}
          {createType == "reply" && (
            <SagedComponent
              register={register}
              sagedChecked={sagedChecked}
              setSagedChecked={setSagedChecked}
            />
          )}
          {/* subject */}
          {createType == "thread" && <SubjectComponent register={register} />}
          {/* body */}
          <BodyComponent register={register} isQuickreply={isQuickreply} />
          {/* file */}
          <FileInputComponent
            register={register}
            board={board}
            fileNsfwChecked={fileNsfwChecked}
            setFileNsfwChecked={setFileNsfwChecked}
            createType={createType}
          />
          {isAdmin(user) && createType == "thread" && (
            <div>
              <p>Admin Options</p>
              {/* stickied */}
              <StickiedComponent
                register={register}
                stickiedChecked={stickiedChecked}
                setStickiedChecked={setStickiedChecked}
              />
              {/* locked */}
              <LockedComponent
                register={register}
                lockedChecked={lockedChecked}
                setLockedChecked={setLockedChecked}
              />
            </div>
          )}
          <br />

          {!submitting ? (
            <>
              {allowedToPost(user) ? (
                <>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      margin: "auto",
                    }}
                    className="success"
                  >
                    Submit
                  </button>
                </>
              ) : (
                <>
                  Anonymous posting is temporarily disabled until better spam
                  attack prevention mechanisms are in place. Users can still
                  post with an anonymous ID if they are signed in with Plug or
                  Stoic and are either a SeaChad or have a minimum .01 ICP.
                </>
              )}
            </>
          ) : (
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LoadingSpinner isSmall={false} />
            </span>
          )}
        </div>
      </form>
    </div>
  )
}

export default PostForm
