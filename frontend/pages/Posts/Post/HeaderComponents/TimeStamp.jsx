import React, { useState } from "react"
import { timeSince } from "../../../../utils/timeSince"
import { getHumanDateFromNano } from "../../../../utils/getHumanDateFromNano"
export const TimeStamp = function ({ timeStamp }) {
  const [timeStampToggle, setTimeStampToggle] = useState(false)
  return (
    <span
      style={{ cursor: "pointer" }}
      onClick={() => setTimeStampToggle(!timeStampToggle)}
    >
      {timeStampToggle
        ? getHumanDateFromNano(timeStamp)
        : timeSince(timeStamp) + " ago"}
    </span>
  )
}
