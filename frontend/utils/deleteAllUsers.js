export function deleteAllUsers(actor, setLoading) {
    setLoading({ deleteUsers: true });
    actor.deleteAllUsers().then(() => {
        setLoading({ deleteUsers: false });
    })
}