import {AutocompleteData, NS, ScriptArg} from '@ns';
import {BotnetManagerOptions, CommandFlags} from 'global';
import {getAutocompletions} from 'utils/index';
import {addBot} from 'utils/botnet/addBot';
import {botnetFlagsSchemas} from 'utils/botnet/botnetFlagsSchemas';
import {botnetReviver as reviver} from 'utils/botnet/botnetReviver';
import {cacheBotnetMap} from 'utils/botnet/cacheBotnetMap';
import {hydrateBotnetMap} from 'utils/botnet/hydrateBotnetMap';
import {ramOptions} from 'utils/botnet/ramOptions';
import {getDataStash} from 'utils/data/index';

const argsSchema: CommandFlags = [...botnetFlagsSchemas.addBotnet];

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

const addBotnet = (
    ns: NS,
    {botnet: botnetName, quantity = 1, ram: rams}: BotnetManagerOptions
) => {
    let botnetMap = hydrateBotnetMap(ns, {stash: {id: 'botnetMap', reviver}});
    if (!botnetMap || !botnetMap.size || !(botnetMap instanceof Map)) {
        botnetMap = new Map();
    }
    const nets: string[] = Array.isArray(botnetName)
        ? (botnetName as string[])
        : ([botnetName] as string[]);
    const ram = (rams as ScriptArg[]).pop();
    for (const net of nets) {
        if (!botnetMap.has(net)) {
            botnetMap.set(net, new Set());
        }
        const botnet = botnetMap.get(net);
        if (ram) {
            const members = botnet ? [...botnet.values()] : [];
            const added = addBot(ns, {bot: net, quantity, ram});
            botnetMap.set(
                net,
                new Set([
                    ...members,
                    ...added.map((hostname: string) => hostname)
                ])
            );
        }
    }

    cacheBotnetMap(ns, {botnetMap});
    return botnetMap;
};

const main = async (ns: NS) => {
    const {botnet, quantity = 1, ram} = ns.flags(argsSchema);
    return addBotnet(ns, {botnet, quantity, ram});
};

export default main;
export {addBotnet, autocomplete, main};
