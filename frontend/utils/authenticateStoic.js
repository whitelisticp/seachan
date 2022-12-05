import { StoicIdentity } from "ic-stoic-identity"
import { Actor, HttpAgent } from "@dfinity/agent"
import { idlFactory } from "../../src/declarations/seachan_backend"
import { getUserFromActor } from "./getUserFromActor"

export async function authenticateStoic(setActor, setUser, setSignInLoading) {
  return await StoicIdentity.load()
    .then(async (identity) => {
      if (!identity) {
        var identity = await StoicIdentity.connect()
      }
      const agent = new HttpAgent({ identity })
      var actor = Actor.createActor(idlFactory, {
        agent,
        canisterId: process.env.SEACHAN_BACKEND_CANISTER_ID,
      })
      setActor(actor)
      setUser(getUserFromActor(actor, setUser, setSignInLoading, "stoic"))
    })
    .catch((err) => alert(err))
}
