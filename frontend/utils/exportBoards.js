import { downloadExport } from './downloadExport';

export function exportBoards(actor, setLoading) {
    setLoading({ exportBoards: true });
    actor.listBoards().then((boards) => {
        if (boards['ok']) {
            downloadExport(boards['ok'], 'exported_boards.json', 'text/plain');
        }
        setLoading({ exportBoards: false });
    })
}