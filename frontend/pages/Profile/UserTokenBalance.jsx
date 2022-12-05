import React, { useEffect, useState } from "react"
import { syncIcpBalance } from "../../utils/syncIcpBalance"
import { forgetIcpBalance } from "../../utils/forgetIcpBalance"
import icpLogo from "../../assets/icp.svg"
import pinkWojak from "../../assets/pink-wojak.png"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

const UserTokenBalance = ({ actor, setUser, user }) => {
  const [isLoading, setLoading] = useState({
    syncIcpBalance: false,
    forgetIcpBalance: false,
  })
  const [plugTokenBalances, setPlugTokenBalances] = useState([])

  useEffect(() => {
    async function refreshPlugBalances() {
      await window.ic.plug.requestBalance().then((balances) => {
        setPlugTokenBalances(balances)
        syncIcpBalance(actor, user, setUser, setLoading)
        setLoading({ syncIcpBalance: false })
      })
    }

    async function refreshStoicBalances() {
      await window.ic.plug.requestBalance().then((balances) => {
        setPlugTokenBalances(balances)
        setLoading({ syncIcpBalance: false })
      })
    }

    if (user?.principalSource == "plug") {
      setLoading({ syncIcpBalance: true })
      refreshPlugBalances()
    }
    if (user?.principalSource == "stoic") {
      setLoading({ syncIcpBalance: true })
      refreshStoicBalances()
    }
  }, [])

  return (
    <div>
      {["ic0"].includes(user?.principalSource) && (
        <span>Balance not available for Internet Identity authentication</span>
      )}
      {["plug"].includes(user?.principalSource) && (
        <>
          {!isLoading.syncIcpBalance ? (
            <>
              {plugTokenBalances.some((item) => item.amount > 0) ? (
                plugTokenBalances.map(
                  (token) =>
                    token.amount != 0 && (
                      <p>
                        <span>
                          {token.name +
                            ": " +
                            Math.floor(token.amount * 100) / 100}
                        </span>
                        {token.symbol == "ICP" ? (
                          <img
                            className="horizontal-padding"
                            style={{ width: "2em" }}
                            src={icpLogo}
                          />
                        ) : (
                          <span>{" " + token.symbol}</span>
                        )}
                      </p>
                    ),
                )
              ) : (
                <>
                  <span>None Found</span>
                  <br />
                  <img
                    className="horizontal-padding"
                    style={{ width: "2em" }}
                    src={pinkWojak}
                  />
                </>
              )}
            </>
          ) : (
            <LoadingSpinner isSmall={true} />
          )}
        </>
      )}
      {["stoic"].includes(user?.principalSource) && (
        <>
          {user?.icpBalance != 0 ? (
            <>
              <span>{"ICP: " + Math.floor(user?.icpBalance * 100) / 100}</span>
              <img
                className="horizontal-padding"
                style={{ width: "2em" }}
                src={icpLogo}
              />
            </>
          ) : (
            <>
              <span>None Found</span>
              <br />
              <img
                className="horizontal-padding"
                style={{ width: "2em" }}
                src={pinkWojak}
              />
            </>
          )}

          <br />

          <button
            onClick={() => {
              syncIcpBalance(actor, user, setUser, setLoading)
            }}
            disabled={isLoading.syncIcpBalance}
            style={{
              margin: "5px",
              backgroundColor: "var(--success-color)",
              color: "var(--text-color)",
            }}
            title="Sync ICP Balance"
          >
            {!isLoading.syncIcpBalance ? "Sync" : "Syncing..."}
          </button>
          {user?.icpBalance != 0 && (
            <button
              onClick={() => {
                forgetIcpBalance(actor, setLoading, setUser)
              }}
              disabled={isLoading.forgetIcpBalance}
              style={{
                margin: "5px",
                backgroundColor: "var(--danger-color)",
                color: "var(--text-color)",
              }}
              title="Forget ICP Balance"
            >
              {!isLoading.forgetIcpBalance ? "Forget" : "Forgetting..."}
            </button>
          )}
        </>
      )}
    </div>
  )
}
export default UserTokenBalance
