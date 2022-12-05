export function clearWatchedThreads(actor, setUser, setLoading) {
  setLoading(true)
  actor.clearWatchedThreads().then((user) => {
    if (user["ok"]) {
      setUser(user["ok"])
    } else {
      alert("error", user["err"])
    }
    setLoading(false)
  })
}
