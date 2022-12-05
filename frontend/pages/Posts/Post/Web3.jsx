import React, { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faWallet,
  faGift,
  faHandHoldingHeart,
} from "@fortawesome/free-solid-svg-icons"
import { anonymizeBalance } from "../../../utils/anonymizeBalance"
import TipForm from "../../../components/form/post/TipForm"

export const Web3 = ({ actor, post, showWeb3, onPage }) => {
  const [showTipForm, setShowTipForm] = useState(false)
  const [icpReceived, setIcpReceived] = useState(post?.icpReceived.toFixed(2))

  useEffect(() => {}, [icpReceived])

  return (
    <div
      style={{
        textAlign: "center",
        width: "100%",
        backgroundColor:
          (onPage == "board" || (onPage == "thread" && post.op == false)) &&
          "var(--post-header-color)",
      }}
    >
      {/* ICP balance */}
      {post.ownerPrincipal.toString() != "2vxsx-fae" &&
        post.icpBalance > 0 &&
        showWeb3 && (
          <span style={{ padding: "0 1em" }}>
            <FontAwesomeIcon title="ICP Stack" icon={faWallet} />
            <span className="horizontal-padding">
              ~{anonymizeBalance(post.icpBalance)} ICP
            </span>
          </span>
        )}
      {/* received ICP balance */}
      {post.ownerPrincipal.toString() != "2vxsx-fae" && post.acceptTips &&
        showWeb3 && (
          <span style={{ padding: "0 1em" }}>
            <FontAwesomeIcon title="ICP Received" icon={faGift} />
            <span className="horizontal-padding">{icpReceived} ICP</span>
          </span>
        )}
      {/* Send ICP to post owner */}
      {post.ownerPrincipal.toString() != "2vxsx-fae" &&
        post.acceptTips &&
        showWeb3 && (
          <span className="horizontal-padding" style={{ padding: "0 1em" }}>
            <FontAwesomeIcon
              style={{ cursor: "pointer" }}
              title="Send ICP"
              onClick={() => setShowTipForm(!showTipForm)}
              className="pointer horizontal-padding"
              icon={faHandHoldingHeart}
            />
            {showTipForm && (
              <TipForm
                actor={actor}
                post={post}
                setShowTipForm={setShowTipForm}
                setIcpReceived={setIcpReceived}
              />
            )}
          </span>
        )}
    </div>
  )
}
// export default Web3
