import { ENABLE_SPAM_PREVENTION } from "../constants"
import { getCookie } from "./getCookie"
import { isAuthenticated } from "./isAuthenticated"

export function allowedToPost(user) {
  if (
    getCookie("banned") ||
    localStorage.getItem("banned") ||
    (!isAuthenticated(user) && !ENABLE_SPAM_PREVENTION) ||
    (isAuthenticated(user) &&
      ENABLE_SPAM_PREVENTION &&
      user.icpBalance == 0 &&
      !["Admin", "Seachad"].includes(Object.keys(user.role || {})[0] || {})) ||
    (isAuthenticated(user) && user.blackListed)
  ) {
    return false
  } else {
    return true
  }
}
