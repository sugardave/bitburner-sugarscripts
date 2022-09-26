import {NS} from '@ns';
import {
    AutoCompleter,
    AutoCompletionResult,
    CommandFlags,
    Executor,
    NetServer
} from 'global';
// Classes
class BaseServer implements NetServer {
    chain?: string[] | undefined;
    hostname;
    constructor({chain, hostname}: NetServer) {
        this.chain = chain;
        this.hostname = hostname;
    }
}

class Server extends BaseServer {
    constructor(hostname: string) {
        super({hostname});
    }
}

//  Methods
// autocompletion
const commonSchema: CommandFlags = [['target', '']];

const getAutoCompletions: AutoCompleter = ({
    args,
    completionKeys,
    defaultReturn = []
}): AutoCompletionResult => {
    const regex = /^--.*/;
    for (const arg of args.slice(-2)) {
        const completionKey = arg as string;
        if (regex.test(completionKey)) {
            const completions = completionKeys[completionKey.slice(2)];
            if (completions.length) {
                return completions;
            }
        }
    }
    return defaultReturn;
};

// pwning
const portCrackerExists = (ns: NS, portCracker: string) => {
    const {fileExists} = ns;
    return fileExists(portCracker, 'home');
};

const getPortCrackers = (ns: NS) => {
    const {brutessh, ftpcrack, httpworm, relaysmtp, sqlinject} = ns;
    const portCrackers = {
        'BruteSSH.exe': brutessh,
        'FTPCrack.exe': ftpcrack,
        'relaySMTP.exe': relaysmtp,
        'HTTPWorm.exe': httpworm,
        'SQLInject.exe': sqlinject
    };
    const portCrackerMap = new Map();
    for (const [portCracker, method] of Object.entries(portCrackers)) {
        if (portCrackerExists(ns, portCracker)) {
            portCrackerMap.set(portCracker, method);
        }
    }
    return portCrackerMap;
};

const getNumPortCrackers = (ns: NS) => getPortCrackers(ns).size;

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

export {commonSchema, crackPorts, getAutoCompletions, Server};
