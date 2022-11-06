import {NS} from '@ns';
import {CommandFlags, HacknetServerManagerOptions} from 'global';

const customSchema: CommandFlags = [['action', '']];

const argsSchema: CommandFlags = [...customSchema];

const hacknetServerManager = (
    ns: NS,
    {action}: HacknetServerManagerOptions
) => {
    switch (action) {
        case 'purchaseServer':
            break;

        default:
            break;
    }
};

const main = async (ns: NS) => {
    const {flags} = ns;

    const {action}: HacknetServerManagerOptions = flags(argsSchema);
    return hacknetServerManager(ns, {action});
};

export default main;
export {hacknetServerManager, main};
