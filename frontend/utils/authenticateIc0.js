import { AuthClient } from "@dfinity/auth-client"
import { Actor, HttpAgent } from "@dfinity/agent"
import { idlFactory } from "../../src/declarations/seachan_backend"
import { getUserFromActor } from "./getUserFromActor"

const identityProvider = "https://identity.ic0.app/#authorize"

export async function authenticateIc0(setActor, setUser, setSignInLoading) {
  setSignInLoading(true)
  const authClient = await AuthClient.create()
  if (await authClient.isAuthenticated()) {
    handleAuthenticated(authClient)
  }

  await authClient.login({
    identityProvider: identityProvider,
    onSuccess: async () => {
      handleAuthenticated(authClient)
    },
  })

  async function handleAuthenticated(authClient) {
    const identity = await authClient.getIdentity()

    const agent = new HttpAgent({ identity })
    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: process.env.SEACHAN_BACKEND_CANISTER_ID,
    })
    setActor(actor)
    setUser(getUserFromActor(actor, setUser, setSignInLoading, "ic0"))
  }
}
