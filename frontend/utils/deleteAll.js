import { deleteAllBoards } from './deleteAllBoards';
import { deleteAllPosts } from './deleteAllPosts';
import { deleteAllUsers } from './deleteAllUsers';

export function deleteAll(actor, setLoading) {
    console.log("deleting all")
    setLoading({ deleteAll: true });
    deleteAllBoards(actor, setLoading)
    deleteAllPosts(actor, setLoading)
    deleteAllUsers(actor, setLoading)
    setLoading({ deleteAll: false });
    console.log("deleted all")
}
