import {NS} from '@ns';
import {Executor, NetServer} from 'global';
import {Server} from 'utils/index';

interface IScannerNamedParameters {
    executor?: Executor;
    from?: string;
    recurse?: boolean;
    server?: NetServer;
}

const getImmediateConnections = (ns: NS, {hostname}: NetServer): string[] =>
    ns.scan(hostname);

const omniscan = (
    ns: NS,
    {
        executor,
        from = '',
        recurse = true,
        server = new Server('home')
    }: IScannerNamedParameters = {}
) => {
    const upstream = server.hostname;
    server.chain = getImmediateConnections(ns, server)
        .filter((hostname) => hostname !== from)
        .map((hostname) => {
            if (recurse) {
                omniscan(ns, {executor, from: upstream, server: {hostname}});
            }
            return hostname;
        });
    if (executor) {
        executor(ns, server, {});
    }
    return server.chain;
};

const main = async (ns: NS) => omniscan(ns);

export default main;
export {main, omniscan};
