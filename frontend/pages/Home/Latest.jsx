import React from "react"
import InfoPost from "../../components/ui/InfoPost"

const Latest = () => {
  return (
    <InfoPost
      id="latest"
      minimize={true}
      postHeaderText={"Latest"}
      postBodyText={
        <p
          style={{
            whiteSpace: "pre-wrap",
            paddingLeft: "5px;",
            paddingRight: "5px;",
          }}
        >
          <span style={{ color: "var(--greentext-color)" }}>
            &gt; Latest 2022/11/28
          </span>
          <br />
          Community moderation
          <br />
          Persistent logins
          <br />
          Highlight all posts by clicking poster's ID
          <br />
          Option to copy all public thread principals to clipboard
          <br />
          Alternative board/thread view
          <br />
          Updated anon ID algorithm
          <br />
          <br />
          <span style={{ color: "var(--greentext-color)" }}>&gt; Upcoming</span>
          <br />
          Github update
          <br />
          Ability to directly donate cycles to front/backend canisters
          <br />
          Direct messaging
          <br />
          Duplicate file detector (with cool-down period) to prevent spam
          <br />
          (You)s
          <br />
          Polls, proposals, voting, and proto-DAO functionality
          <br />
          Seachan OC art contest
          <br />
          Faster IPFS file load speeds and alternative file upload methods
          <br />
          NFT gated boards
          <br />
          <br />
          <span style={{ color: "var(--greentext-color)" }}>
            &gt; Known Issues
          </span>
          <br />
          Some users unable to log in using Stoic wallet
          <br />
          ICNS domain seachan.icp.xyz not loading backend data for anonymous
          actor calls
          <br />
        </p>
      }
    />
  )
}
export default Latest
