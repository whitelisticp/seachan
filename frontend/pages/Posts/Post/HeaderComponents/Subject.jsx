import { isMobile } from "react-device-detect"

export const Subject = function ({ subject }) {
  return (
    subject != "" && (
      <span
        style={
          !isMobile
            ? {
                color: "var(--subject-color)",
                fontWeight: "700",
              }
            : {}
        }
      >
        {subject}
      </span>
    )
  )
}
