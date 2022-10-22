import {NS} from '@ns';
import {hydrateBotnetMap} from 'utils/botnet/hydrateBotnetMap';

const getBotnetStatus = (ns: NS) => {
    const {tprint} = ns;
    const botnets = hydrateBotnetMap(ns);
    const statusMessage = `\nbotnets:\n${Array.from(botnets.keys()).map(
        (botnet) => {
            return `${botnet}\n`;
        }
    )}`;

    tprint(statusMessage);
};

const main = async (ns: NS) => {
    return getBotnetStatus(ns);
};

export default main;
export {getBotnetStatus, main};
