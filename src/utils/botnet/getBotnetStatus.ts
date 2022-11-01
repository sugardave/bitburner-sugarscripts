import {NS} from '@ns';
import {hydrateBotnetMap} from 'utils/botnet/hydrateBotnetMap';

const getBotnetStatus = (ns: NS): string => {
    const contents = hydrateBotnetMap(ns, {
        mapType: 'all',
        skipStash: false,
        stashName: 'botnetMap'
    });
    const parsed = JSON.parse(contents);
    const botnets = new Map(parsed);
    const statusMessage = `\nbotnets:\n${Array.from(botnets.keys()).map(
        (botnet) => {
            return `${botnet}\n`;
        }
    )}`;

    return statusMessage;
};

const main = async (ns: NS) => {
    const {tprint} = ns;
    const output = getBotnetStatus(ns);
    tprint(output);
    return output;
};

export default main;
export {getBotnetStatus, main};
