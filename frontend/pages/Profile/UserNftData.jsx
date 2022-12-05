import React, { useState } from "react"
import { syncUserNfts } from "../../utils/syncUserNfts"
import { forgetUserNfts } from "../../utils/forgetUserNfts"

const UserNftData = ({ actor, setUser, user }) => {
  const [isLoading, setLoading] = useState({
    syncUserNfts: false,
    forgetUserNfts: false,
  })

  return (
    <div>
      {user?.nftCollection.length > 0 &&
        user?.nftCollection.map((nft) => {
          return (
            <div style={{ textAlign: "center" }} key={nft.canisterId}>
              <p className="vertical-spacing">{nft.name}</p>
              {nft.tokens?.map((token) => (
                <img
                  key={token.index}
                  src={token.url}
                  title={"#" + token.index}
                  style={{ width: "200px", height: "200", margin: "10px" }}
                />
              ))}
            </div>
          )
        })}
      <button
        onClick={() => {
          syncUserNfts(actor, user, setUser, setLoading)
        }}
        disabled={isLoading.syncUserNfts}
        style={{
          backgroundColor: "var(--success-color)",
          color: "var(--text-color)",
        }}
        title="Powered by DAB NFT registry"
      >
        {!isLoading.syncUserNfts ? "Sync NFTs" : "Syncing NFTs..."}
      </button>
      {user?.nftCollection.length > 0 && (
        <button
          onClick={() => {
            forgetUserNfts(actor, user, setUser, setLoading)
          }}
          style={{
            marginLeft: "10px",
            backgroundColor: "var(--danger-color)",
            color: "var(--text-color)",
          }}
          title="Forget NFTs"
        >
          {!isLoading.forgetUserNfts ? "Forget NFTs" : "Forgetting NFTs..."}
        </button>
      )}
    </div>
  )
}
export default UserNftData
