export function parseTags(tags) {
  var outString = ""
  tags.forEach((tagObj) => {
    // if (tagObj.tag != "Flag" && tagObj.tag != "Hide") {
      var tag = Object.keys(tagObj.tag)[0]
      outString += tag + " ("
      tagObj.vote.forEach((tagVoteObj) => {
        var role = Object.keys(tagVoteObj.role)[0]
        var count = tagVoteObj.count
        outString += count
      })
      outString += ") " + "\n"
    // }
  })
  return outString
}
