import { generateAnonId } from "./generateAnonId"
export function getAnonId() {
  const anonId = localStorage.getItem("anonId") || generateAnonId()
  localStorage.setItem("anonId", anonId)
  return anonId
}
