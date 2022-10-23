import {AutocompleteData, NS, ScriptArg} from '@ns';
import {Botnet, BotnetManagerOptions, BotnetMap, CommandFlags} from 'global';
import {botnetFlagsSchemas} from 'utils/botnet/botnetFlagsSchemas';
import {cacheBotnetMap} from 'utils/botnet/cacheBotnetMap';
import {generateBotnetName} from 'utils/botnet/generateBotnetName';
import {hydrateBotnetMap} from 'utils/botnet/hydrateBotnetMap';
import {getAutocompletions} from 'utils/index';
import {getDataStash} from 'utils/data/index';

const argsSchema: CommandFlags = [...botnetFlagsSchemas.removeBot];

const autocomplete = ({flags}: AutocompleteData, args: ScriptArg[]) => {
    const {stash} = getDataStash().dataset;
    const {cache} = JSON.parse(stash as string);
    const botnets = new Map(cache.botnetMap);
    const completionKeys = {
        bot: [...Array.from(botnets.keys())] as string[]
    };
    flags(argsSchema);
    return getAutocompletions({args, completionKeys});
};

const removeBot = (ns: NS, {bot}: BotnetManagerOptions) => {
    const {deleteServer} = ns;
    const botnets = hydrateBotnetMap(ns);
    const botnetName = generateBotnetName(bot as string);
    const deleted: boolean = deleteServer(bot as string);
    if (deleted) {
        const {members = []} = botnets.get(botnetName) as Botnet;
        botnets.set(botnetName, {
            name: botnetName,
            members: [...members].filter(({hostname}) => {
                return hostname !== bot;
            })
        });
        cacheBotnetMap(ns, botnets as BotnetMap);
    }

    return deleted;
};

const main = async (ns: NS) => {
    const {flags} = ns;
    const {bot} = flags(argsSchema);
    return removeBot(ns, {bot});
};

export default main;
export {autocomplete, main, removeBot};
