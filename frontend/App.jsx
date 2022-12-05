import React, { useState } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { isAdmin } from "./utils/isAdmin"
import Navbar from "./components/navbar/Navbar"
import Introduction from "./pages/Home/Introduction"
import Latest from "./pages/Home/Latest"
import BoardList from "./pages/Home/BoardList"
import Board from "./pages/Posts/Board"
import Thread from "./pages/Posts/Thread"
import Profile from "./pages/Profile/Profile"
import NotFound from "./components/ui/NotFound"
import Logo from "./pages/Home/Logo"
import Title from "./pages/Home/Title"
import SubTitle from "./pages/Home/SubTitle"
import SiteStats from "./pages/Home/SiteStats"
import CycleStats from "./pages/Home/CycleStats"
import MaintenancePage from "./pages/Home/MaintenancePage"
import Banner from "./pages/Posts/Banner"
import { UNDER_MAINTENANCE } from "./constants"

function App() {
  // user
  const [user, setUser] = useState()
  const [actor, setActor] = useState()
  //boards
  const [listedBoards, setListedBoards] = useState([])
  const [board, setBoard] = useState()
  // theme
  const [theme, setTheme] = useState("dark")

  var navbar = (
    <Navbar
      setActor={setActor}
      setBoard={setBoard}
      setUser={setUser}
      user={user}
      theme={theme}
      setTheme={setTheme}
    />
  )

  var homePage = (
    <>
      <Logo />
      <Title />
      <SubTitle />
      <Introduction />
      <SiteStats />
      <CycleStats />
      <Latest />
      <BoardList
        listedBoards={listedBoards}
        setListedBoards={setListedBoards}
        setBoard={setBoard}
        user={user}
        theme={theme}
      />
    </>
  )

  var boardPage = (
    <>
      <Banner />
      <Board
        actor={actor}
        setActor={setActor}
        user={user}
        setUser={setUser}
        board={board}
        setBoard={setBoard}
        setListedBoards={setListedBoards}
      />
    </>
  )

  var threadPage = (
    <>
      <Banner />
      <Thread
        actor={actor}
        setActor={setActor}
        board={board}
        setBoard={setBoard}
        setListedBoards={setListedBoards}
        user={user}
        setUser={setUser}
      />
    </>
  )

  var profilePage = (
    <Profile
      user={user}
      setUser={setUser}
      actor={actor}
      setActor={setActor}
      setListedBoards={setListedBoards}
      setBoard={setBoard}
      listedBoards={listedBoards}
    />
  )

  return (
    <Router>
      {/* navbar */}
      {navbar}
      {UNDER_MAINTENANCE && !isAdmin(user) ? (
        <Routes>
          {/* maintenance */}
          <Route path="*" element={<MaintenancePage />} />
        </Routes>
      ) : (
        <Routes>
          {/* home */}
          <Route path="/" element={homePage} />
          {/* profile */}
          <Route path="/profile/:principal" element={profilePage} />
          {/* board */}
          <Route path="/:boardParam" element={boardPage} />
          <Route path="/:boardParam/:pageParam" element={boardPage} />
          {/* thread */}
          <Route path="/:boardParam/thread/:threadParam" element={threadPage} />
          {/* not found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </Router>
  )
}

export default () => <App />
