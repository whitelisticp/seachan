import React from "react"
import { isAdmin } from "../../../utils/isAdmin"
import { isMod } from "../../../utils/isMod"
import { isAuthenticated } from "../../../utils/isAuthenticated"
import { isSeaChad } from "../../../utils/isSeaChad"
import { getThreadPrincipals } from "../../../utils/getThreadPrincipals"

export const OptionComponent = function ({
  actor,
  user,
  setUser,
  post,
  setPost,
  showOptions,
  setShowOptions,
  minimizePost,
  setMinimizePost,
  hidePost,
  showWeb3,
  setShowWeb3,
  setHidePost,
  showReport,
  setShowReport,
  isLoading,
  setLoading,
  setRefreshPosts,
  refreshPosts,
}) {
  return (
    <>
      {showOptions && !isLoading && (
        <>
          <select
            style={{ lineHeight: "normal" }}
            required
            name="options"
            disabled={isLoading}
            onChange={(e) => {
              if (e.target.value == "none") {
                return
              }
              // Post Information
              else if (isAdmin(user) && e.target.value == "PostInformation") {
                console.log(post)
              }
              // User Information
              else if (
                isAdmin(user) &&
                e.target.value == "UserInformation" &&
                post.ownerPrincipal.toString() != "2vxsx-fae"
              ) {
                setLoading(true)
                // if (post.ownerPrincipal.toString())
                actor.getUser(post.ownerPrincipal).then((user) => {
                  console.log(user["ok"])
                  setLoading(false)
                })
              }
              // Toggle Blacklist Principal
              else if (isAdmin(user) && e.target.value == "Ban") {
                setLoading(true)
                console.log("user", actor)
                if (post.ownerPrincipal.toString != "2vxsx-fae") {
                  actor
                    .toggleBlacklistPrincipal(post.ownerPrincipal)
                    .then((updatedUser) => {
                      console.log("bannedUser", updatedUser)
                    })
                }
                actor
                  .hidePost(post.boardAbbreviation + "/" + post.id)
                  .then((updatedPost) => {
                    if (updatedPost["ok"]) {
                      setPost(updatedPost["ok"])
                    } else if (updatedPost["err"]) {
                      alert("error", updatedPost["err"])
                    }
                    setRefreshPosts(!refreshPosts)
                    setLoading(false)
                  })
                document.cookie = "banned=true"
                localStorage.setItem("banned", true)
              }
              // NSFW
              else if (isAdmin(user) && e.target.value == "ToggleNSFW") {
                setLoading(true)
                actor
                  .toggleNSFW(post.boardAbbreviation + "/" + post.id)
                  .then((updatedPost) => {
                    setLoading(false)
                    setPost(updatedPost["ok"])
                  })
              }
              // Watch
              else if (
                isAuthenticated(user) &&
                e.target.value == "ToggleWatch"
              ) {
                setLoading(true)
                actor
                  .userToggleWatchThread(post.boardAbbreviation + "/" + post.id)
                  .then((updatedUser) => {
                    if (updatedUser["ok"]) {
                      setUser(updatedUser["ok"])
                    } else if (updatedUser["err"]) {
                      alert("error", updatedUser["err"])
                    }
                    setLoading(false)
                  })
              }
              // Minimize
              else if (e.target.value == "ToggleMinimize") {
                if (isAuthenticated(user)) {
                  setLoading(true)
                  actor
                    .toggleMinimizedPost(post.boardAbbreviation + "/" + post.id)
                    .then((updatedUser) => {
                      if (updatedUser["ok"]) {
                        setUser(updatedUser["ok"])
                      } else if (updatedUser["err"]) {
                        alert("error", updatedUser["err"])
                      }
                      setLoading(false)
                    })
                } else {
                  setMinimizePost(!minimizePost)
                }
              }
              // Hide
              else if (e.target.value == "ToggleHide") {
                if (isAuthenticated(user)) {
                  setLoading(true)
                  actor
                    .toggleHidePost(post.boardAbbreviation + "/" + post.id)
                    .then((updatedUser) => {
                      if (updatedUser["ok"]) {
                        setUser(updatedUser["ok"])
                      } else if (updatedUser["err"]) {
                        alert("error", updatedUser["err"])
                      }
                      setLoading(false)
                    })
                } else {
                  setHidePost(!hidePost)
                }
              }
              // Web3
              else if (e.target.value == "ToggleWeb3") {
                setShowWeb3(!showWeb3)
              }
              // Admin Hide for all
              else if (
                (isAdmin(user) || isMod(user)) &&
                e.target.value == "HideForAll"
              ) {
                setLoading(true)
                actor
                  .hidePost(post.boardAbbreviation + "/" + post.id)
                  .then((updatedPost) => {
                    if (updatedPost["ok"]) {
                      setPost(updatedPost["ok"])
                    } else if (updatedPost["err"]) {
                      alert("error", updatedPost["err"])
                    }
                    setRefreshPosts(!refreshPosts)
                    setLoading(false)
                  })
              } else if (e.target.value == "CopyPrincipals") {
                var threadPrincipals = getThreadPrincipals(post)
                navigator.clipboard.writeText(threadPrincipals)
              }
              // Report
              else if (e.target.value == "Report" && !post.stickied) {
                setShowReport(!showReport)
              }
              // Refresh
              else if (e.target.value == "RefreshPost") {
                setLoading(true)
                actor
                  .getPost(post.boardAbbreviation + "/" + post.id)
                  .then((updatedPost) => {
                    if (updatedPost["ok"]) {
                      setPost(updatedPost["ok"])
                    } else if (updatedPost["err"]) {
                      alert("error", updatedPost["err"])
                    }
                    setLoading(false)
                  })
              }
              setShowOptions(false)
            }}
          >
            <option value="none" selected disabled hidden>
              Select Option
            </option>
            <option value="ToggleMinimize">
              {minimizePost ? "Maximize" : "Minimize"}
            </option>
            {<option value="ToggleHide">{hidePost ? "Unhide" : "Hide"}</option>}
            {
              <option value="ToggleWeb3">
                {!showWeb3 ? "Show Web3" : "Hide Web3"}
              </option>
            }
            {post.op && isAuthenticated(user) && (
              <option value="ToggleWatch">Watch Thread</option>
            )}
            {post.op && (
              <option value="CopyPrincipals">Copy Thread Principals</option>
            )}
            <option value="RefreshPost">Refresh Post</option>
            {/* <option value="Tag">Tag</option> */}
            {!post.stickied &&
              !(
                isSeaChad(user) &&
                post.reporterPrincipals.includes(user?.principal)
              ) && (
                <option value="Report">
                  {(isSeaChad(user) ? "SeaChad: " : "") + "Report"}
                </option>
              )}

            {isAdmin(user) && (
              <option value="PostInformation">Admin: Post Information</option>
            )}
            {isAdmin(user) && post.ownerPrincipal.toString() != "2vxsx-fae" && (
              <option value="UserInformation">Admin: User Information</option>
            )}
            {isAdmin(user) && post.filePath != "" && (
              <option value="ToggleNSFW">Admin: Toggle NSFW</option>
            )}
            {isAdmin(user) && (
              <option value="HideForAll">
                {post.hidden ? "Admin: Unhide for all" : "Admin: Hide for all"}
              </option>
            )}
            {isAdmin(user) && <option value="Ban">Admin: Ban</option>}
          </select>
        </>
      )}
    </>
  )
}
