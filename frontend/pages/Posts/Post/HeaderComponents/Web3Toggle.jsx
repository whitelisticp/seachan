import { isAdmin } from "../../../../utils/isAdmin"
import icpLogo from "../../../../assets/icp.svg"

export const Web3Toggle = function ({
  post,
  user,
  showWeb3,
  setShowWeb3,
  setShowOptions,
  setShowTag,
  setShowReport,
}) {
  return (
    (!post.flagged || isAdmin(user)) &&
    (post.acceptTips || post.icpBalance != "0") && (
      <img
        style={{ width: "2em", cursor: "pointer" }}
        onClick={() => {
          setShowOptions(false)
          setShowTag(false)
          setShowReport(false)
          setShowWeb3(!showWeb3)
        }}
        src={icpLogo}
      />
    )
  )
}
