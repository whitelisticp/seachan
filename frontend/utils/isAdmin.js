export function isAdmin(user) {
  if (user) {
    return ["Admin"].includes(Object.keys(user.role || {})[0] || {})
  } else {
    return false
  }
}
