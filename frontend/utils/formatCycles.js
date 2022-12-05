import { TRILLION } from "../constants"

export function formatCycles(cycles) {
  const cyclesCleaned = Number(cycles) / TRILLION
  return cyclesCleaned.toFixed(1)
}
