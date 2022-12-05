import { icpXdrConversionRate } from "./icpXdrConversionRate"
import { toBigInt } from "./toBigInt"
import { E8S_PER_ICP } from "../constants"
import { TRILLION } from "../constants"

export const convertCyclesToICP = async (cyclesIn) => {
  const conversionRate = await icpXdrConversionRate()
  const test = toBigInt(cyclesIn) * conversionRate
  console.log("toBigInt(cyclesIn)", toBigInt(cyclesIn))

  console.log("test", test)
  // const cyclesInConverted = BigInt(cyclesIn * TRILLION)
  // console.log("cyclesInConverted", cyclesInConverted)
  // const conversionRate = await icpXdrConversionRate()
  // console.log("conversionRate", conversionRate)
  // const e8ToCycleRatio = conversionRate / cyclesInConverted
  // console.log("e8ToCycleRatio", e8ToCycleRatio)
  // console.log("typeof cyclesIn", typeof cyclesInConverted)
  // console.log("typeof e8ToCycleRatio", typeof e8ToCycleRatio)

  // const cycles = cyclesInConverted * e8ToCycleRatio
  // console.log("cycles", cycles)
  // const cyclesSlash = toBigInt(cyclesIn) / e8ToCycleRatio
  // console.log("cyclesSlash", cyclesSlash)
  // const converted = Number(cycles) / Number(TRILLION)
  return test
}
