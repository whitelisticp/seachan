export function isNotAdmin(user) {
  if (user) {
    return !["Admin"].includes(Object.keys(user.role || {})[0] || {})
  } else {
    return true
  }
}
