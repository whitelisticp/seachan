import { deleteAll } from './deleteAll';
import { importBoards } from './importBoards';
import { importPosts } from './importPosts';
import { importUsers } from './importUsers';

export function importAll(actor, jsonArray, setLoading) {
    setLoading({ importAll: true })
    deleteAll(actor, setLoading)
    var boardsToImport = jsonArray.boards
    var postsToImport = jsonArray.posts
    var usersToImport = jsonArray.users
    importBoards(actor, boardsToImport, setLoading)
    importPosts(actor, postsToImport, setLoading)
    importUsers(actor, usersToImport, setLoading)
    setLoading({ importAll: false })
}