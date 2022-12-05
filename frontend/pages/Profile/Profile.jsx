import React, { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import Admin from "./Admin"
import { Buffer } from "buffer"
import InfoPost from "../../components/ui/InfoPost"
import UserNames from "./UserNames"
import UserNavbarBoards from "./UserNavbarBoards"
import UserTokenBalance from "./UserTokenBalance"
import UserNftData from "./UserNftData"
import UserMinimizedPosts from "./UserMinimizedPosts"
import UserHiddenPosts from "./UserHiddenPosts"
import UserWatchedThreads from "./UserWatchedThreads"
import UserAutoLogin from "./UserAutoLogin"
import UserShowNsfw from "./UserShowNsfw"
import UserShowFlagged from "./UserShowFlagged"
import UserRole from "./UserRole"
import { getHumanDateFromNano } from "../../utils/getHumanDateFromNano"
import { getCondensedPrincipal } from "../../utils/getCondensedPrincipal"
import { timeSince } from "../../utils/timeSince"
import { isAdmin } from "../../utils/isAdmin"
import { getListedBoards } from "../../utils/getListedBoards"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClipboard } from "@fortawesome/free-solid-svg-icons"
import { useForm } from "react-hook-form"
window.Buffer = Buffer

const Profile = ({
  setUser,
  user,
  actor,
  setActor,
  setBoard,
}) => {
  if (!user) {
    return <Navigate replace to={"/"} />
  }
  const [listedBoards, setListedBoards] = useState(getListedBoards())

  let navigate = useNavigate()
  const { register } = useForm()

  const [showCondensedPrincipal, setShowCondensedPrincipal] = useState(true)
  const [showTimeSinceDateFormat, setShowTimeSinceDateFormat] = useState(true)

  useEffect(() => {
    if (user.persistentAuthentication) {
      localStorage.setItem("persistAuth", user.principalSource)
    } else {
      localStorage.removeItem("persistAuth")
    }
  }, [user])

  return (
    <>
      <InfoPost
        id="userInfo"
        minimize={false}
        postHeaderText={"Information"}
        postBodyText={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            <span>
              {"Principal: "}
              <span
                onClick={() =>
                  setShowCondensedPrincipal(!showCondensedPrincipal)
                }
                style={{ cursor: "pointer" }}
              >
                {showCondensedPrincipal
                  ? getCondensedPrincipal(user.principal.toString())
                  : user.principal.toString()}
              </span>
              <span>
                <FontAwesomeIcon
                  icon={faClipboard}
                  title="Copy Principal"
                  style={{ cursor: "pointer", marginLeft: ".5rem" }}
                  onClick={() =>
                    navigator.clipboard.writeText(user.principal.toString())
                  }
                />
              </span>
            </span>
            <span>Login Type: {user.principalSource}</span>

            <span>
              {"First Login: "}
              <span
                onClick={() =>
                  setShowTimeSinceDateFormat(!showTimeSinceDateFormat)
                }
                style={{ cursor: "pointer" }}
              >
                {showTimeSinceDateFormat
                  ? timeSince(user?.timeStamp) + " ago"
                  : getHumanDateFromNano(user?.timeStamp)}
              </span>
            </span>
          </div>
        }
      />

      {/* Role */}
      <InfoPost
        id="role"
        minimize={false}
        postHeaderText={"Role"}
        postBodyText={<UserRole user={user} />}
      />

      {/* Token Balance */}
      <InfoPost
        id="tokenBalance"
        minimize={false}
        postHeaderText={"Tokens"}
        postBodyText={
          <UserTokenBalance actor={actor} user={user} setUser={setUser} />
        }
      />
      {/* UserNames */}
      <InfoPost
        id="userNames"
        minimize={user.userNames.length == 0}
        postHeaderText={"Usernames"}
        postBodyText={<UserNames actor={actor} user={user} setUser={setUser} />}
      />
      {/* Navbar Boards */}
      <InfoPost
        id="navbarBoards"
        minimize={user.navbarBoards.length == 0}
        postHeaderText={"Navbar Boards"}
        postBodyText={
          <UserNavbarBoards
            actor={actor}
            user={user}
            setUser={setUser}
            listedBoards={listedBoards}
          />
        }
      />
      {/* Options */}
      <InfoPost
        id="options"
        minimize={false}
        postHeaderText={"Options"}
        postBodyText={
          <>
            <UserAutoLogin actor={actor} user={user} setUser={setUser} />
            <UserShowNsfw actor={actor} user={user} setUser={setUser} />
            <UserShowFlagged actor={actor} user={user} setUser={setUser} />
          </>
        }
      />
      {/* Watched Threads */}
      <InfoPost
        id="watchedThreads"
        minimize={user.watchedThreads.length == 0}
        postHeaderText={"Watched Threads"}
        postBodyText={
          <UserWatchedThreads
            actor={actor}
            user={user}
            setUser={setUser}
            listedBoards={listedBoards}
          />
        }
      />

      {/* Minimized posts */}
      <InfoPost
        id="minimizedPosts"
        minimize={user.minimizedPosts.length == 0}
        postHeaderText={"Minimized Posts"}
        postBodyText={
          <UserMinimizedPosts
            actor={actor}
            user={user}
            setUser={setUser}
            listedBoards={listedBoards}
          />
        }
      />
      {/* Hidden posts */}
      <InfoPost
        id="hiddenPosts"
        minimize={user.hiddenPosts.length == 0}
        postHeaderText={"Hidden Posts"}
        postBodyText={
          <UserHiddenPosts
            actor={actor}
            user={user}
            setUser={setUser}
            listedBoards={listedBoards}
          />
        }
      />

      {/* NFTs */}
      <InfoPost
        id="nfts"
        minimize={user.nftCollection.length == 0}
        postHeaderText={"NFTs"}
        postBodyText={
          <UserNftData actor={actor} user={user} setUser={setUser} />
        }
      />
      {/* Sign Out */}
      <div
        style={{
          justifyContent: "center",
          textAlign: "center",
          display: "flex",
          flex: "1",
          overflow: "auto",
          paddingTop: "1em",
        }}
      >
        <button
          onClick={() => {
            setUser()
            setActor()
            navigate("/")
          }}
          style={{
            backgroundColor: "var(--danger-color)",
            color: "var(--text-color)",
          }}
        >
          Sign Out
        </button>
      </div>
      {
        // admin
        isAdmin(user) && (
          <Admin
            user={user}
            setUser={setUser}
            setListedBoards={setListedBoards}
            actor={actor}
            setActor={setActor}
            setBoard={setBoard}
            listedBoards={listedBoards}
          />
        )
      }
      <br />
      <br />
    </>
  )
}
export default Profile
