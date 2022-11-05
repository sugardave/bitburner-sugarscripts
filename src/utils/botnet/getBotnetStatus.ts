import {NS} from '@ns';
import {botnetReviver as reviver} from 'utils/botnet/botnetReviver';
import {hydrateBotnetMap} from 'utils/botnet/hydrateBotnetMap';

const getBotnetStatus = (ns: NS): string => {
    const botnetMap = hydrateBotnetMap(ns, {
        mapType: 'all',
        skipStash: false,
        stash: {id: 'botnetMap', reviver}
    });
    const statusMessage = `\nbotnets:\n${Array.from(botnetMap.keys())}`;

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
