export async function forgetIcpBalance(actor, setLoading, setUser) {
    setLoading({ forgetIcpBalance: true });
    await actor.forgetIcpBalance().then(user => {
        setUser(user["ok"]);
        setLoading({ forgetIcpBalance: false });
    })
}