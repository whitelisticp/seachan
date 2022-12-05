import { getPersistAuth } from "./getPersistAuth"

export function getUserFromActor(
  actor,
  setUser,
  setSignInLoading,
  principalSource,
) {
  if (actor) {
    setSignInLoading(true)
    actor.getOrCreateUser({ principalSource: principalSource }).then((user) => {
      setUser(user["ok"])
      if (
        getPersistAuth() != user["ok"].principalSource &&
        user["ok"].persistentAuthentication
      ) {
        localStorage.setItem("persistAuth", user["ok"]?.principalSource)
      }
      setSignInLoading(false)
    })
  }
}
