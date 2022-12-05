import { E8S_PER_ICP } from "../constants"

export const toBigInt = (amount) => {
  const [integral, fractional] = `${amount}`.split(".")
  if ((fractional ?? "0").length > 8) {
    throw new Error("More than 8 decimals not supported.")
  }
  return (
    BigInt(integral ?? 0) * E8S_PER_ICP +
    BigInt((fractional ?? "0").padEnd(8, "0"))
  )
}
