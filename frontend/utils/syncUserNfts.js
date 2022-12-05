import { getAllUserNFTs } from '@psychedelic/dab-js'

export async function syncUserNfts(actor, user, setUser, setLoading) {
    setLoading({ syncUserNfts: true });
    const nftCollections = await getAllUserNFTs({ user: user?.principal.toString() });
    nftCollections.forEach(collection => {
        if (collection['tokens']) {
            var tokenArray = [];
            collection['tokens'].forEach(token => {
                const index = token.index;
                const url = token.url;
                tokenArray.push({ "index": index, "url": url })
            });
            delete collection['tokens'];
            collection['tokens'] = tokenArray;
        }
    });
    await actor.syncUserNfts(nftCollections).then(user => {
        setUser(user["ok"]);
        setLoading({ syncUserNfts: false });
    })
}