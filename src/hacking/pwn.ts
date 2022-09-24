import {NS} from '@ns';
import {Executor, NetServer} from 'global';
import {crackPorts} from 'utils/index';

const prepForPwnage: Executor = (ns: NS, server: NetServer) => {
    if (!crackPorts(ns, server)) {
        return;
    }
    return server;
};

const pwnServer: Executor = (ns: NS, server: NetServer) => {
    const {getServer, nuke, tprint} = ns;
    const {hostname: target, numOpenPortsRequired} = getServer(
        server.hostname as string
    );
    tprint(
        `pwnServer ${server.hostname}; needs ${numOpenPortsRequired} ports open`
    );
    if ((numOpenPortsRequired as number) > 0) {
        if (!prepForPwnage(ns, server)) {
            return;
        }
    }
    nuke(target as string);
    tprint(`${target} PWNed!`);
};

const pwn = (ns: NS) => {
    const {flags, getHostname} = ns;
    const {target} = flags([['target', getHostname()]]);

    return pwnServer(ns, target as NetServer);
};

const main = async (ns: NS) => pwn(ns);

export default main;
export {main, pwn, pwnServer};
