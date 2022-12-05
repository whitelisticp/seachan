export function clearMinimizedPosts(actor, setUser, setLoading) {
    setLoading(true);
    actor.clearMinimizedPosts().then((user) => {
        if (user['ok']) { setUser(user['ok']); }
        else { alert("error", user['err']) }
        setLoading(false);
    })
}