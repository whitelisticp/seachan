export function clearHiddenPosts(actor, setUser, setLoading) {
    setLoading(true);
    actor.clearHiddenPosts().then((user) => {
        if (user['ok']) { setUser(user['ok']); }
        else { alert("error", user['err']) }
        setLoading(false);
    })
}