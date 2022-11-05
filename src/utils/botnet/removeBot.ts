import {AutocompleteData, NS, ScriptArg} from '@ns';
import {BotnetManagerOptions, CommandFlags} from 'global';
import {botnetFlagsSchemas} from 'utils/botnet/botnetFlagsSchemas';
import {botnetReviver as reviver} from 'utils/botnet/botnetReviver';
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
    const {deleteServer, killall, serverExists} = ns;
    const botnetMap = hydrateBotnetMap(ns, {stash: {id: 'botnetMap', reviver}});
    const botName: string = bot as string;
    const botnetName = generateBotnetName(botName);
    let deleted = false;
    if (serverExists(botName)) {
        killall(botName);
        deleted = deleteServer(botName);
    }
    if (!botnetMap.has(botnetName)) {
        botnetMap.set(botnetName, new Set());
    }
    const botnet = botnetMap.get(botnetName) || new Set();
    const members = Array.from([...botnet.values()]);
    members
        .filter((hostname) => {
            return hostname !== botName;
        })
        .map((m) => botnet.add(m));
    cacheBotnetMap(ns, {botnetMap});

    return deleted;
};

const main = async (ns: NS) => {
    const {flags} = ns;
    const {bot} = flags(argsSchema);
    return removeBot(ns, {bot});
};

export default main;
export {autocomplete, main, removeBot};
