import {AutocompleteData, NS, ScriptArg} from '@ns';
import {Botnet, BotnetManagerOptions, BotnetMap, CommandFlags} from 'global';
import {botnetFlagsSchemas} from 'utils/botnet/botnetFlagsSchemas';
import {cacheBotnetMap} from 'utils/botnet/cacheBotnetMap';
import {hydrateBotnetMap} from 'utils/botnet/hydrateBotnetMap';
import {removeBot} from 'utils/botnet/removeBot';
import {getDataStash} from 'utils/data/index';
import {getAutocompletions} from 'utils/index';

const argsSchema: CommandFlags = [...botnetFlagsSchemas.removeBotnet];

const autocomplete = ({flags}: AutocompleteData, args: ScriptArg[]) => {
    const {stash} = getDataStash().dataset;
    const {cache} = JSON.parse(stash as string);
    const botnets = new Map(cache.botnetMap);
    const completionKeys = {
        botnet: [...Array.from(botnets.keys())] as string[]
    };
    flags(argsSchema);
    return getAutocompletions({args, completionKeys});
};

const removeBotnet = (ns: NS, botnets: string[]) => {
    const botnetMap = hydrateBotnetMap(ns);
    for (const botnet of botnets) {
        const {members = []} = botnetMap.get(botnet) as Botnet;
        [...members].map(({hostname}) => {
            removeBot(ns, {bot: hostname} as BotnetManagerOptions);
        });
        if (!(botnetMap.get(botnet) as Botnet).members?.length) {
            botnetMap.delete(botnet);
        }
    }
    cacheBotnetMap(ns, botnetMap as BotnetMap);
};

const main = async (ns: NS) => {
    const {flags} = ns;
    const {botnet: botnets} = flags(argsSchema);
    return removeBotnet(ns, botnets as string[]);
};

export default main;
export {autocomplete, main, removeBotnet};
