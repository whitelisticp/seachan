import { Principal } from "@dfinity/principal"

export function importPosts(actor, jsonArray, setLoading) {
  setLoading({ importPosts: true })
  for (let post of Object.values(jsonArray)) {
    post.fileSize = BigInt(parseInt(post.fileSize))
    post.icpBalance = parseFloat(post.icpBalance)
    post.icpReceived = parseFloat(post.icpReceived)
    post.ownerPrincipal = Principal.fromText(post.ownerPrincipal)
    post.latestActivityTimeStamp = BigInt(
      parseInt(post.latestActivityTimeStamp),
    )
    post.timeStamp = BigInt(parseInt(post.timeStamp))
    var updatedReporterPrincipals = post.reporterPrincipals.map((x) =>
      Principal.fromText(x),
    )
    post.reporterPrincipals = updatedReporterPrincipals
  }

  actor.importPosts(jsonArray).then((postsImported) => {
    console.log("imported", postsImported["ok"].length, "posts")
    setLoading({ importPosts: false })
  })
}
