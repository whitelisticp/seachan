import React, { useState } from "react"
import LoadingSpinner from "../../ui/LoadingSpinner"
import { ANON_REPORT_LIMIT } from "../../../constants"
import { AUTHENTICATED_REPORT_LIMIT } from "../../../constants"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFlag } from "@fortawesome/free-solid-svg-icons"
import { isMobile } from "react-device-detect"

export const ReportComponent = function ({
  actor,
  post,
  setPost,
  showReport,
  setShowReport,
  onPage,
}) {
  const [isLoading, setLoading] = useState(false)
  var postKey = post.boardAbbreviation + "/" + post.id
  return (
    <div
      style={{
        textAlign: "center",
        width: isMobile ? "100%" : "inherit",
        backgroundColor:
          (onPage == "board" || (onPage == "thread" && post.op == false)) &&
          "var(--post-header-color)",
      }}
    >
      {!isLoading && (
        <>
          <FontAwesomeIcon
            icon={faFlag}
            style={{
              paddingLeft: ".3rem",
              paddingRight: ".3rem",
              color: "var(--danger-color-light)",
            }}
          />
          <select
            style={{ lineHeight: "normal" }}
            required
            name="tag"
            disabled={isLoading}
            onChange={(e) => {
              setLoading(true)
              if (e.target.value == "none") {
                return
              } else {
                var reportVariant = { [e.target.value]: null }
                actor
                  .reportPost(
                    postKey,
                    reportVariant,
                    ANON_REPORT_LIMIT,
                    AUTHENTICATED_REPORT_LIMIT,
                  )
                  .then((reportedPost) => {
                    if (reportedPost["ok"]) {
                      setPost(reportedPost["ok"])
                    } else {
                      alert(Object.keys(reportedPost["err"])[0])
                    }
                    setLoading(false)
                    setShowReport(!showReport)
                  })
              }
            }}
          >
            <option value="none" selected disabled hidden>
              Select Report Type
            </option>
            <option value="LowQuality">Low Quality</option>
            <option value="OffTopic">Off Topic</option>
            <option value="Spam">Spam</option>
            <option value="Scam">Scam</option>
            <option value="Illegal">Illegal (in USA)</option>
          </select>
        </>
      )}
      {isLoading && <LoadingSpinner isSmall={true} />}
    </div>
  )
}
