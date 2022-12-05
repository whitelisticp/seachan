export function deleteAllBoards(actor, setLoading) {
    setLoading({ deleteBoards: true });
    actor.deleteAllBoards().then(() => {
        setLoading({ deleteBoards: false });
    })
}