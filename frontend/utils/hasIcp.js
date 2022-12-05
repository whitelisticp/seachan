export function hasIcp(user) {
  if (user != undefined && user.icpBalance >= 0.01) {
    return true
  } else {
    return false
  }
}
