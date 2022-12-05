export async function forgetUserNfts(actor, user, setUser, setLoading) {
    setLoading({ forgetUserNfts: true });
    await actor.forgetNfts().then(user => {
        setUser(user["ok"]);
        setLoading({ forgetUserNfts: false });
    })
}