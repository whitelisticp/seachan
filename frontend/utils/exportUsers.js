import { downloadExport } from './downloadExport'

export function exportUsers(actor, setLoading) {
    setLoading({ exportUsers: true });
    actor.listUsers().then((users) => {
        if (users['ok']) {
            downloadExport(users['ok'], 'exported_users.json', 'text/plain');
        }
        setLoading({ exportUsers: false });
    })
}