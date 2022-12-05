import { nanoid, customRandom, urlAlphabet } from "nanoid"
import seedrandom from "seedrandom"
import { ID_LENGTH } from "../constants"

export function generateAnonId(seed = "") {
  if (seed == "") {
    return nanoid(ID_LENGTH)
  } else {
    const rng = seedrandom(seed)
    const nanoid = customRandom(urlAlphabet, ID_LENGTH, (size) => {
      return new Uint8Array(size).map(() => 256 * rng())
    })
    return nanoid()
  }
}
