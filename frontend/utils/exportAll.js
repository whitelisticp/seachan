import { downloadExport } from './downloadExport';

export async function exportAll(actor, setLoading) {
    setLoading({ exportAll: true });
    let [boards, posts, users] = await Promise.all([actor.listBoards(), actor.listPosts(), actor.listUsers()]);
    var all = { 'boards': boards['ok'], 'posts': posts['ok'], 'users': users['ok'] }
    downloadExport(all, 'seachan_export_' + Date.now() + '.json', 'text/plain');
    setLoading({ exportAll: false });
}