export function clearNavbarBoards(actor, setUser, setLoading) {
    setLoading(true);
    actor.clearNavbarBoards().then((user) => {
        if (user['ok']) { setUser(user['ok']); }
        else { alert("error", user['err']) }
        setLoading(false);
    })
}