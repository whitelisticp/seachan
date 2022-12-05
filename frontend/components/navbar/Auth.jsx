import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import LoadingSpinner from "../ui/LoadingSpinner"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faInfinity,
  faPlug,
  faRightFromBracket,
  faS,
  faXmark,
} from "@fortawesome/free-solid-svg-icons"
import { getCondensedPrincipal } from "../../utils/getCondensedPrincipal"
import { getPersistAuth } from "../../utils/getPersistAuth"
import { authenticateIc0 } from "../../utils/authenticateIc0"
import { authenticatePlug } from "../../utils/authenticatePlug"
import { authenticateStoic } from "../../utils/authenticateStoic"
import { styles } from "../../styles"
import { isMobile } from "react-device-detect"

export function Auth({ setActor, user, setUser }) {
  const [signInLoading, setSignInLoading] = useState(false)

  // auto login if persistent authentication is enabled
  useEffect(() => {
    async function autoConnectPlug() {
      await authenticatePlug(setActor, setUser, setSignInLoading)
    }
    async function autoConnectStoic() {
      await authenticateStoic(setActor, setUser, setSignInLoading)
    }
    async function autoConnectIc0() {
      await authenticateIc0(setActor, setUser, setSignInLoading)
    }
    if (getPersistAuth() == "plug") {
      autoConnectPlug()
    }
    if (getPersistAuth() == "stoic") {
      autoConnectStoic()
    }
    if (getPersistAuth() == "ic0" && !isMobile) {
      autoConnectIc0()
    }
  }, [])

  return (
    <>
      {/* loading */}
      {signInLoading && (
        <span>
          <LoadingSpinner isSmall={true} />
        </span>
      )}
      {signInLoading && (
        <FontAwesomeIcon
          title="Cancel"
          onClick={() => {
            setSignInLoading(false)
            setActor()
            setUser()
          }}
          style={{
            cursor: "pointer",
            color: "var(--danger-color-light)",
            marginLeft: "5px",
            marginRight: "5px",
          }}
          icon={faXmark}
        />
      )}
      {/* plug */}
      {!signInLoading && !user && (
        <FontAwesomeIcon
          title="Plug Wallet"
          onClick={async () => {
            setSignInLoading(true)
            await authenticatePlug(setActor, setUser, setSignInLoading)
          }}
          style={styles.authIconStyle}
          icon={faPlug}
        />
      )}
      {/* stoic */}
      {!signInLoading && !user && (
        <FontAwesomeIcon
          title="Stoic Wallet"
          onClick={async () => {
            setSignInLoading(true)
            await authenticateStoic(setActor, setUser, setSignInLoading)
          }}
          style={styles.authIconStyle}
          icon={faS}
        />
      )}
      {/* ic0 */}
      {!signInLoading && !user && (
        <FontAwesomeIcon
          title="Internet Id"
          onClick={async () => {
            setSignInLoading(true)
            await authenticateIc0(setActor, setUser, setSignInLoading)
          }}
          style={styles.authIconStyle}
          icon={faInfinity}
        />
      )}
      {/* principal */}
      {!signInLoading && user && (
        <Link title="profile" to={"/profile/" + user?.principal.toString()}>
          {getCondensedPrincipal(user?.principal.toString())}
        </Link>
      )}
      {/* sign out */}
      {!signInLoading && user && (
        <FontAwesomeIcon
          title="sign out"
          onClick={() => {
            setUser()
            setActor()
          }}
          style={styles.authIconStyle}
          icon={faRightFromBracket}
        />
      )}
    </>
  )
}
export default Auth
