import { importAll } from './importAll';
import { importBoards } from './importBoards';
import { importPosts } from './importPosts';
import { importUsers } from './importUsers';

export const importData = (type, actor, setLoading) => (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = e => {
        var jsonArray = JSON.parse(e.target.result)
        if (type == "all") {
            importAll(actor, jsonArray, setLoading)
        }
        if (type == "boards") {
            importBoards(actor, jsonArray, setLoading)
        }
        if (type == "posts") {
            importPosts(actor, jsonArray, setLoading)
        }
        if (type == "users") {
            importUsers(actor, jsonArray, setLoading)
        }
    };
}