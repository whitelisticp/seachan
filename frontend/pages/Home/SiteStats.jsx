import React, { useEffect, useState } from "react"
import InfoPost from "../../components/ui/InfoPost"
import { isMobile } from "react-device-detect"
import { seachan_backend } from "../../../src/declarations/seachan_backend"

const SiteStats = () => {
  const [refreshStats, setRefreshStats] = useState(false)
  const [statBoardCount, setStatBoardCount] = useState("?")
  const [statUserCount, setStatUserCount] = useState("?")
  const [statPostCount, setStatPostCount] = useState("?")

  useEffect(() => {
    seachan_backend.getBoardCount().then((boardCount) => {
      setStatBoardCount(boardCount.toString())
    })
    seachan_backend.getPostCount().then((postCount) => {
      setStatPostCount(postCount.toString())
    })
    seachan_backend.getUserCount().then((userCount) => {
      setStatUserCount(userCount.toString())
    })
  }, [refreshStats])

  return (
    <InfoPost
      id="siteStats"
      minimize={false}
      refresh={refreshStats}
      setRefresh={setRefreshStats}
      postHeaderText={"Seachan Stats"}
      postBodyText={
        <div
          style={{
            display: "flex",
            background: "var(--post-bg-color)",
            justifyContent: "space-between",
            columnGap: "1rem",
            color: "var(--text-color)",
            overflow: "auto",
          }}
        >
          <span>Boards: {statBoardCount}</span>
          <span>Posts: {statPostCount}</span>
          <span>Principals: {statUserCount}</span>
        </div>
      }
    />
  )
}
export default SiteStats
