import janny from "../../../../assets/janny.png"
import { ANON_REPORT_LIMIT } from "../../../../constants"
import { AUTHENTICATED_REPORT_LIMIT } from "../../../../constants"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFlag } from "@fortawesome/free-solid-svg-icons"
export const Flagged = function ({ post }) {
  var reportLimit = 0
  if (post.ownerPrincipal.toString() == "2vxsx-fae") {
    reportLimit = ANON_REPORT_LIMIT
  } else {
    reportLimit = AUTHENTICATED_REPORT_LIMIT
  }

  const jannyInfo =
    post.reporterPrincipals.length +
    " of the 100 SeaChads " +
    (post.reporterPrincipals.length == 1 ? "has" : "have") +
    " voted to hide this post. At " +
    reportLimit +
    " SeaChad reports, the post will be removed from public view but still " +
    'accessible to authenticated users who opt-in using the "Show All Flagged" option in the board/thread header or profile page preference.' +
    "\nIf you are among the first 100 authenticatated users, you should see your role update to SeaChad and your report will count toward the janny counter." +
    "\nNote: The number and weighting of votes is subject to change based off of this experimentation."

  return (
    post.reporterPrincipals.length > 0 &&
    !post.stickied && (
      <>
        <img
          style={{ cursor: "pointer", width: "2em" }}
          title={jannyInfo}
          onClick={() => {
            alert(jannyInfo)
          }}
          src={janny}
        />
        {"" + post.reporterPrincipals.length + "/" + reportLimit}
        {post.flagged && (
          <span>
            <FontAwesomeIcon
              icon={faFlag}
              style={{
                paddingLeft: ".3rem",
                paddingRight: ".3rem",
                color: "var(--danger-color-light)",
              }}
            />
          </span>
        )}
      </>
    )
  )
}
