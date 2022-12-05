export function isSeaChad(user) {
  if (user) {
    return ["SeaChad"].includes(Object.keys(user.role || {})[0] || {})
  } else {
    return false
  }
}
