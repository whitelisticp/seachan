import { compareValues } from "./compareValues"
import { seachan_backend } from "../../src/declarations/seachan_backend"

export async function getListedBoards() {
  seachan_backend.getListedBoards().then((boardResult) => {
    var boards = boardResult["ok"]
    var boardsSorted = boards.sort(
      compareValues("latestActivityTimeStamp", "desc"),
    )
    return boardsSorted
  })
}
