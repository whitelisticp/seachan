import { compareValues } from "./compareValues"
import { seachan_backend } from "../../src/declarations/seachan_backend"

export function refreshBoardList(setListedBoards) {
  seachan_backend.getListedBoards().then((boardResult) => {
    setListedBoards(
      boardResult["ok"].sort(compareValues("latestActivityTimeStamp", "desc")),
    )
  })
}
