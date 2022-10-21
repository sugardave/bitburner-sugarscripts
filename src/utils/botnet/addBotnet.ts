import {AutocompleteData, NS, ScriptArg} from '@ns';
import {BotnetManagerOptions, Botnet, CommandFlags, BotnetMap} from 'global';
import {getAutocompletions} from 'utils/index';
import {addBot} from 'utils/botnet/addBot';
import {botnetMap} from 'utils/botnet/botnetMap';
import {botnetFlagsSchema} from 'utils/botnet/botnetFlagsSchema';
import {cacheBotnetMap} from 'utils/botnet/cacheBotnetMap';
import {hydrateBotnetMap} from 'utils/botnet/hydrateBotnetMap';
import {ramOptions} from 'utils/botnet/ramOptions';
import {getDataStash} from 'utils/data/index';

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

const addBotnet = (
    ns: NS,
    {botnet, quantity, ram: rams}: BotnetManagerOptions
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
            for (let i = 0; i < quantity; i += 1) {
                const bot = addBot(ns, {botnet: net, ram}, {botnetMap});
                if (bot.hostname) {
                    members.push(bot);
                }
            }
            botnets.set(net, {name: net, members});
        }
    }

    cacheBotnetMap(ns, botnets);

    return botnets.get(botnet as string);
};

const main = async (ns: NS) => {
    const {flags} = ns;
    const {botnet, quantity, ram} = flags(argsSchema);
    return addBotnet(ns, {botnet, quantity, ram});
};

export default main;
export {addBotnet, autocomplete, main};
