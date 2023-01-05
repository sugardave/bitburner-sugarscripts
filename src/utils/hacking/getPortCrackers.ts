import {NS} from '@ns';

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

const main = async (ns: NS) => getPortCrackers(ns);

export default main;
export {getPortCrackers, main};
