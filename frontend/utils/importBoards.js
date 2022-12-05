import { Principal } from "@dfinity/principal";

export function importBoards(actor, jsonArray, setLoading) {
    setLoading({ importBoards: true })
    for (let board of Object.values(jsonArray)) {
        board.timeStamp = BigInt(parseInt(board.timeStamp))
        board.ownerPrincipal = Principal.fromText(board.ownerPrincipal)
        board.latestActivityTimeStamp = BigInt(parseInt(board.latestActivityTimeStamp))
        board.allFileSize = BigInt(parseInt(board.allFileSize))
    }
    actor.importBoards(jsonArray).then((boardsImported) => {
        console.log("imported", boardsImported['ok'].length, "boards")
        setLoading({ importBoards: false })
    })
}