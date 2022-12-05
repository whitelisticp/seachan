export function getPersistAuth() {
  if (typeof localStorage.getItem("persistAuth") === "undefined") {
    return ""
  } else {
    return localStorage.getItem("persistAuth")
  }
}
