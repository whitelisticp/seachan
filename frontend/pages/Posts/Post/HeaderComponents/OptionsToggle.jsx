import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons"

export const OptionsToggle = function ({
  setShowOptions,
  showOptions,
  setShowWeb3,
  setShowTag,
  setShowReport,
}) {
  return (
    <span>
      <label title="options">
        <FontAwesomeIcon
          icon={faEllipsisVertical}
          title={"Post Options"}
          onClick={() => {
            setShowOptions(!showOptions)
            setShowWeb3(false)
            setShowTag(false)
            setShowReport(false)
          }}
          style={{
            paddingLeft: "1rem",
            paddingRight: "1rem",
            cursor: "pointer",
          }}
        />
      </label>
    </span>
  )
}
