import {NS} from '@ns';
import {cacheBotnetMap} from 'utils/botnet/cacheBotnetMap';
import {generateBotnetName} from 'utils/botnet/generateBotnetName';

const botnetMap = new Map();

const sortBot = (bot: string) => {
    const botnetName = generateBotnetName(bot);
    if (!botnetMap.has(botnetName)) {
        botnetMap.set(botnetName, new Set());
    }
    const botnet = botnetMap.get(botnetName);
    botnet.add(bot);
    botnetMap.set(botnetName, botnet);
};

const refreshBotnetMap = (ns: NS) => {
    const {getPurchasedServers} = ns;
    // find all owned servers except home
    const bots = getPurchasedServers();
    for (const bot of bots) {
        sortBot(bot);
    }
    // write to botnet map cache
    cacheBotnetMap(ns, {
        botnetMap
    });

    return botnetMap;
};

const main = async (ns: NS) => {
    return refreshBotnetMap(ns);
};

export default main;
export {main, refreshBotnetMap};
