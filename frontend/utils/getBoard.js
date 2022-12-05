export async function getBoard(actor, board, abbreviation) {
  if (typeof board === typeof undefined) {
    var boardResult = await actor.getBoard(abbreviation)
    if (boardResult["ok"]) {
      return boardResult["ok"]
    } else {
      console.log(boardResult["err"])
      return null
    }
  } else {
    return board
  }
}
