import { icpXdrConversionRate } from "./icpXdrConversionRate"
import { TRILLION } from "../constants"
import { E8S_PER_ICP } from "../constants"
import { toBigInt } from "./toBigInt"

export const convertICPToCycles = async (icp) => {
  const conversionRate = await icpXdrConversionRate()
  const e8ToCycleRatio = conversionRate / E8S_PER_ICP
  const cycles = toBigInt(icp) * e8ToCycleRatio
  const converted = Number(cycles) / Number(TRILLION)
  return converted
}
