export function isMod(user) {
  if (user) {
    return ["Admin", "Mod"].includes(Object.keys(user.role || {})[0] || {})
  } else {
    return false
  }
}
