import { idlFactory } from "../../src/declarations/seachan_backend"
import { isMobile } from "react-device-detect"
import { getUserFromActor } from "./getUserFromActor"

export async function authenticatePlug(setActor, setUser, setSignInLoading) {
  if (!isMobile) {
    try {
      setSignInLoading(true)
      window.ic.plug
        .requestConnect()
        .then(async (publicKey) => {
          window.ic.plug
            .createActor({
              canisterId: process.env.SEACHAN_BACKEND_CANISTER_ID,
              interfaceFactory: idlFactory,
            })
            .then((actor) => {
              setActor(actor)
              setUser(
                getUserFromActor(actor, setUser, setSignInLoading, "plug"),
              )
            })
        })
        .catch((error) => {
          alert("The connection was rejected.")
          setSignInLoading(false)
        })
    } catch (e) {
      alert("Plug wallet extension not found. Download at plugwallet.ooo")
      setSignInLoading(false)
    }
  } else {
    alert(
      "Mobile authentication for Plug wallet is not available at this time.",
    )
  }
}
