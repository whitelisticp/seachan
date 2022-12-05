import { downloadExport } from './downloadExport';

export function exportPosts(actor, setLoading) {
    setLoading({ exportPosts: true });
    actor.listPosts().then((posts) => {
        if (posts['ok']) {
            downloadExport(posts['ok'], 'exported_posts.json', 'text/plain');
        }
        setLoading({ exportPosts: false });
    })
}