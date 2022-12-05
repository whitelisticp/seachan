import { isAuthenticated } from "./isAuthenticated"
import { isAdmin } from "./isAdmin"

export function allowedThroughGate(user, board) {
  if (isAdmin(user)) {
    return true
  }
  if (!board.gated) {
    return true
  }
  if (board.gated && !isAuthenticated(user)) {
    return false
  }
  if (board.gated && isAuthenticated(user)) {
    if (["plug", "stoic"].includes(user?.principalSource)) {
      if (board.gateType == "tokens") {
        if (board.gateToken == "ICP") {
          if (user.icpBalance >= board.gateTokenAmount) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      } else if (board.gateType == "nft") {
        if (board.gateToken == "" && user.nftCollection.length > 0) {
          return true
        }
        if (user.nftCollection.length > 0) {
          for (var collection of user.nftCollection) {
            if (collection.name == board.gateToken) {
              return true
            }
          }
        }
        return false
      }
    } else {
      return false
    }
  }
}
