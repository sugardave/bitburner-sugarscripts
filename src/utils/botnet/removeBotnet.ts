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
    const {botnetMap = new Map()} = cache;
    const botnets = new Map([...JSON.parse(botnetMap)]);
    const completionKeys = {
        botnet: Array.from(botnets.keys()) as string[]
    };
    flags(argsSchema);
    return getAutocompletions({args, completionKeys});
};

const removeBotnet = (ns: NS, botnets: string[]) => {
    const botnetMap = hydrateBotnetMap(ns);
    for (const botnet of botnets) {
        if (botnetMap.has(botnet)) {
            let net = botnetMap.get(botnet) as Botnet;
            const {members = []} = net;
            [...members].map(({hostname: bot}) => {
                if (
                    removeBot(ns, {
                        bot,
                        skipCache: true
                    } as BotnetManagerOptions)
                ) {
                    members.pop();
                }
            });
            net = botnetMap.get(botnet) as Botnet;
            if (!net.members?.length) {
                botnetMap.delete(botnet);
            }
        }
    }
    cacheBotnetMap(ns, botnetMap);
};

const main = async (ns: NS) => {
    const {flags} = ns;
    const {botnet: botnets} = flags(argsSchema);
    return removeBotnet(ns, botnets as string[]);
};

export default main;
export {autocomplete, main, removeBotnet};
