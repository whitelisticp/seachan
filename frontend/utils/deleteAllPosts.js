export function deleteAllPosts(actor, setLoading) {
    setLoading({ deletePosts: true });
    actor.deleteAllPosts().then(() => {
        setLoading({ deletePosts: false });
    })
}