import {AutocompleteData, NS, ScriptArg} from '@ns';
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
import {ramOptions} from 'utils/botnet/ramOptions';
import {getDataStash} from 'utils/data/index';
import {getAutocompletions} from 'utils/index';

const argsSchema: CommandFlags = [...botnetFlagsSchema];

const autocomplete = ({flags}: AutocompleteData, args: ScriptArg[]) => {
    const {stash} = getDataStash().dataset;
    const {cache} = JSON.parse(stash as string);
    const botnets = new Map(cache.botnetMap);
    const completionKeys = {
        botnet: [...Array.from(botnets.keys())] as string[],
        ram: [...ramOptions]
    };
    flags(argsSchema);
    return getAutocompletions({args, completionKeys});
};

// TODO: refine/simplify `addBot` to something closer to `removeBot`
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
    const {botnet, quantity = 1, ram} = flags(argsSchema);
    const botnets = hydrateBotnetMap(ns) as BotnetMap;

    const bots = [];
    for (let i = 0; i < quantity; i += 1) {
        bots.push(addBot(ns, {botnet, ram}, {botnetMap: botnets}));
    }
    return bots;
};

export default addBot;
export {addBot, autocomplete, main};
