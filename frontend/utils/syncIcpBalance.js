import { AccountIdentifier, LedgerCanister } from "@dfinity/nns"

export async function syncIcpBalance(actor, user, setUser, setLoading) {
  var icpBalance = 0
  setLoading({ syncIcpBalance: true })
  if (user.principalSource == "plug") {
    await window.ic.plug.requestBalance().then((plugBalances) => {
      icpBalance = plugBalances[0].amount
      actor.syncTokenBalance(icpBalance).then((user) => {
        setUser(user["ok"])
        setLoading({ syncIcpBalance: false })
      })
    })
  } else if (user.principalSource == "stoic") {
    const accountIdentifier = AccountIdentifier.fromPrincipal({
      principal: user.principal,
    })
    const ledger = LedgerCanister.create()
    var stoicBalances = await ledger.accountBalance({ accountIdentifier })
    icpBalance = Number(BigInt(stoicBalances)) / 100_000_000
    actor.syncTokenBalance(icpBalance).then((user) => {
      setUser(user["ok"])
      setLoading({ syncIcpBalance: false })
    })
  }
}
