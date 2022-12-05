import { Principal } from "@dfinity/principal"

export function importUsers(actor, jsonArray, setLoading) {
  setLoading({ importUsers: true })
  for (let user of Object.values(jsonArray)) {
    user.principal = Principal.fromText(user.principal)
    user.latestActivityTimeStamp = BigInt(
      parseInt(user.latestActivityTimeStamp),
    )
    user.timeStamp = BigInt(parseInt(user.timeStamp))
  }
  actor.importUsers(jsonArray).then((usersImported) => {
    console.log("imported", usersImported["ok"].length, "users")
    setLoading({ importUsers: false })
  })
}
