import { Actor, HttpAgent } from "@dfinity/agent"
import { idlFactory } from "../../src/declarations/cmc"
import { TRILLION } from "../constants"

export async function icpXdrConversionRate() {
  const agent = new HttpAgent({ host: "https://ic0.app" })
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId: "rkp4c-7iaaa-aaaaa-aaaca-cai",
  })
  const {
    data: { xdr_permyriad_per_icp },
  } = await actor.get_icp_xdr_conversion_rate()
  const CYCLES_PER_XDR = BigInt(TRILLION)
  return (xdr_permyriad_per_icp * CYCLES_PER_XDR) / BigInt(10_000)
}
