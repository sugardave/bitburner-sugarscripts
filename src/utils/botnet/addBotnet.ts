import {AutocompleteData, NS, ScriptArg} from '@ns';
import {BotnetManagerOptions, Botnet, CommandFlags, BotnetMap} from 'global';
import {getAutocompletions} from 'utils/index';
import {addBot} from 'utils/botnet/addBot';
import {botnetFlagsSchemas} from 'utils/botnet/botnetFlagsSchemas';
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
    {botnet, quantity = 1, ram: rams}: BotnetManagerOptions
) => {
    const botnets = hydrateBotnetMap(ns) as BotnetMap;
    const nets: string[] = Array.isArray(botnet)
        ? (botnet as string[])
        : ([botnet] as string[]);
    const ram = (rams as ScriptArg[]).pop();
    for (const net of nets) {
        if (!botnets.has(net)) {
            botnets.set(net, {name: net, members: []});
        }
        if (quantity && ram) {
            const {members = []} = botnets.get(net) as Botnet;
            const added = addBot(ns, {bot: net, quantity, ram});
            members.splice(members.length, 0, ...added);
            botnets.set(net, {name: net, members});
        }
    }

    cacheBotnetMap(ns, botnets);
    return botnets;
};

const main = async (ns: NS) => {
    const {flags} = ns;
    const {botnet, quantity = 1, ram} = flags(argsSchema);
    return addBotnet(ns, {botnet, quantity, ram});
};

export default main;
export {addBotnet, autocomplete, main};
