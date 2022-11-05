import {NS} from '@ns';
import {CommandFlags, Executor, NetServer} from 'global';
import {getNumPortCrackers} from 'utils/hacking/getNumPortCrackers';
import {getPortCrackers} from 'utils/hacking/getPortCrackers';
import {commonSchema} from 'utils/index';

const argsSchema: CommandFlags = [...commonSchema];

const crackPorts: Executor = (ns: NS, server: NetServer) => {
    const {getServerNumPortsRequired, tprint} = ns;
    const {hostname: target} = server;
    const numPortCrackers = getNumPortCrackers(ns);
    const requiredPortsToCrack = getServerNumPortsRequired(target as string);
    const portCrackers = getPortCrackers(ns);
    const portCrackerNames = [...portCrackers.keys()];
    let cracked = 0;

    if (requiredPortsToCrack > numPortCrackers) {
        tprint(
            `Not enough port crackers to pwn ${target}:  need ${requiredPortsToCrack} but only have ${numPortCrackers}`
        );
        return;
    } else {
        tprint(
            `cracking ${requiredPortsToCrack} port${
                requiredPortsToCrack > 1 ? 's' : ''
            } on ${target}`
        );
    }

    while (cracked < requiredPortsToCrack) {
        const method = portCrackers.get(portCrackerNames[cracked]);
        method(target);
        cracked += 1;
    }
    return server;
};

const main = async (ns: NS) => {
    const {flags} = ns;

    const {target: hostname} = flags(argsSchema);
    return crackPorts(ns, {hostname} as NetServer, {});
};

export default main;
export {crackPorts, main};
