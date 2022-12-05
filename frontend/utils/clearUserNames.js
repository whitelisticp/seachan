export function clearUserNames(actor, setUser, setLoading) {
    setLoading(true);
    actor.clearUserNames().then((user) => {
        if (user['ok']) { setUser(user['ok']); }
        else { alert("error", user['err']) }
        setLoading(false);
    })
}