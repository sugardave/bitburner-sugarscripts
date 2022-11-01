import {NS} from '@ns';
import {cacheBotnetMap} from 'utils/botnet/cacheBotnetMap';
import {generateBotnetName} from 'utils/botnet/generateBotnetName';

const botnetMap = new Map();

const sortBot = (bot: string) => {
    const botnet = generateBotnetName(bot);
    if (!botnetMap.has(botnet)) {
        botnetMap.set(botnet, {members: [], name: botnet});
    }
    const {members = []} = botnetMap.get(botnet);
    if (
        members.findIndex(({hostname}: {hostname: string}) => {
            hostname === bot;
        }) < 0
    ) {
        members.push({hostname: bot, memberOf: botnet});
    }
    botnetMap.set(botnet, {members, name: botnet});
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
        botnetMap,
        mapType: 'all',
        skipStash: false,
        stashName: 'botnetMap'
    });
};

const main = async (ns: NS) => {
    return refreshBotnetMap(ns);
};

export default main;
export {main, refreshBotnetMap};
