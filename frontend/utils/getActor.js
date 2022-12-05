import { seachan_backend } from "../../src/declarations/seachan_backend"

export async function getActor(actor, setActor) {
  if (typeof actor === "undefined") {
    actor = seachan_backend
  }
  setActor(actor)
  return actor
}
