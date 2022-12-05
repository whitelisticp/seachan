import { Principal } from "@dfinity/principal"

export function principalToString(principal) {
  return Principal.fromUint8Array(Object.values(principal._arr)).toString()
}
