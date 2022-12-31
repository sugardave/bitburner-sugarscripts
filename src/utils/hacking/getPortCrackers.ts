import {NS} from '@ns';

const portCrackerExists = (ns: NS, portCracker: string) => {
    return ns.fileExists(portCracker, 'home');
};

const getPortCrackers = (ns: NS) => {
    const portCrackers = {
        'BruteSSH.exe': ns.brutessh.bind(ns),
        'FTPCrack.exe': ns.ftpcrack.bind(ns),
        'relaySMTP.exe': ns.relaysmtp.bind(ns),
        'HTTPWorm.exe': ns.httpworm.bind(ns),
        'SQLInject.exe': ns.sqlinject.bind(ns)
    };
    const portCrackerMap = new Map();
    for (const [portCracker, method] of Object.entries(portCrackers)) {
        if (portCrackerExists(ns, portCracker)) {
            portCrackerMap.set(portCracker, method);
        }
    }
    return portCrackerMap;
};

const main = async (ns: NS) => getPortCrackers(ns);

export default main;
export {getPortCrackers, main};
