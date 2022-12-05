import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faXmark,
  faMinus,
  faPlus,
  faArrowsRotate,
} from "@fortawesome/free-solid-svg-icons"

const InfoPost = ({
  id,
  minimize,
  refresh,
  setRefresh,
  postHeaderText,
  postBodyText,
}) => {

  const remove = () => {
    document.getElementById(id).style.display = "none"
  }
  const [minimizeState, setMinimizeState] = useState(minimize)
  return (
    <div
      style={{
        justifyContent: "center",
        display: "flex",
        flex: "1",
        overflow: "auto",
        paddingTop: "1em",
        maxWidth: "98%",
        margin: "auto",
      }}
      id={id}
    >
      <div style={{ border: "1px solid var(--border-color)" }}>
        <p
          style={{
            display: "flex",

            justifyContent: "space-between",
            backgroundColor: "var(--post-header-color)",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <span
            style={{
              fontWeight: "700",
              paddingLeft: "5px",
              paddingRight: "5px",
            }}
          >
            {postHeaderText}
          </span>
          <span>
            {setRefresh && (
              <>
                <FontAwesomeIcon
                  icon={faArrowsRotate}
                  title="Refresh"
                  style={{
                    cursor: "pointer",
                    marginLeft: ".25rem",
                    marginRight: ".25rem",
                  }}
                  onClick={() => setRefresh(!refresh)}
                />
              </>
            )}
            <FontAwesomeIcon
              icon={minimizeState ? faPlus : faMinus}
              title={minimizeState ? "Maximize " : "Minize"}
              style={{
                cursor: "pointer",
                marginLeft: ".25rem",
                marginRight: ".25rem",
              }}
              onClick={() => setMinimizeState(!minimizeState)}
            />
            <FontAwesomeIcon
              icon={faXmark}
              style={{
                paddingRight: "5px",
                cursor: "pointer",
                color: "var(--danger-color-light)",
              }}
              onClick={() => remove()}
            />
          </span>
        </p>
        {!minimizeState && (
          <div
            style={{
              background: "var(--post-bg-color)",
              color: "var(--text-color)",
              padding: "5px",
              overflow: "auto",
              textAlign: "center",
            }}
          >
            {postBodyText}
          </div>
        )}
      </div>
    </div>
  )
}

export default InfoPost
