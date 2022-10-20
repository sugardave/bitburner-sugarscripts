import {NS, ScriptArg} from '@ns';
import {
    Botnet,
    BotnetManagerOptions,
    BotnetMap,
    BotServer,
    CommandFlags
} from 'global';
import {botnetFlagsSchema} from 'utils/botnet/botnetFlagsSchema';
import {cacheBotnetMap} from 'utils/botnet/cacheBotnetMap';
import {hydrateBotnetMap} from 'utils/botnet/hydrateBotnetMap';

const argsSchema: CommandFlags = [...botnetFlagsSchema];

//TODO: add autocomplete

const addBot = (
    ns: NS,
    {botnet: botnets, ram: rams}: BotnetManagerOptions,
    {botnetMap}: {botnetMap: BotnetMap}
) => {
    const {purchaseServer} = ns;
    const nets = botnetMap && botnetMap.size ? botnetMap : hydrateBotnetMap(ns);
    const botnet = Array.isArray(botnets)
        ? botnets.shift()
        : (botnets as string);
    const ram = Array.isArray(rams) ? (rams as ScriptArg[]).pop() : rams;
    const bot = {
        hostname: purchaseServer(botnet as string, ram as number),
        memberOf: botnet
    } as BotServer;

    if (nets.has(botnet as string)) {
        const {members = []} = nets.get(botnet as string) as Botnet;
        members.push(bot);
        nets.set(botnet as string, {name: botnet as string, members});
    } else {
        nets.set(botnet as string, {
            name: botnet as string,
            members: [bot]
        });
    }

    if (nets.size) {
        cacheBotnetMap(ns, nets as BotnetMap);
    }
    return bot;
};

const main = async (ns: NS) => {
    const {flags} = ns;
    const {botnet, quantity, ram} = flags(argsSchema);
    const botnets = hydrateBotnetMap(ns) as BotnetMap;

    const bots = [];
    for (let i = 0; i < quantity; i += 1) {
        bots.push(addBot(ns, {botnet, ram}, {botnetMap: botnets}));
    }
    return bots;
};

export default addBot;
export {addBot, main};
