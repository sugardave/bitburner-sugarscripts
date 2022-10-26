import {AutocompleteData, NS, ScriptArg} from '@ns';
import {Botnet, BotnetManagerOptions, CommandFlags} from 'global';
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
    const {deleteServer, killall, serverExists} = ns;
    const botnets = hydrateBotnetMap(ns);
    const botName: string = bot as string;
    const botnetName = generateBotnetName(botName);
    let deleted = false;
    if (serverExists(botName)) {
        killall(botName);
        deleted = deleteServer(botName);
        if (!botnets.has(botnetName)) {
            botnets.set(botnetName, {name: botnetName, members: []});
        }
        const {members = []} = botnets.get(botnetName) as Botnet;
        botnets.set(botnetName, {
            name: botnetName,
            members: members.filter(({hostname}) => {
                return hostname !== botName;
            })
        });
        cacheBotnetMap(ns, botnets);
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
