import {AutocompleteData, NS, ScriptArg} from '@ns';
import {BotnetManagerOptions, CommandFlags} from 'global';
import {botnetFlagsSchemas} from 'utils/botnet/botnetFlagsSchemas';
import {botnetReviver as reviver} from 'utils/botnet/botnetReviver';
import {cacheBotnetMap} from 'utils/botnet/cacheBotnetMap';
import {generateBotnetName} from 'utils/botnet/generateBotnetName';
import {hydrateBotnetMap} from 'utils/botnet/hydrateBotnetMap';
import {ramOptions} from 'utils/botnet/ramOptions';
import {getDataStash} from 'utils/data/index';
import {getAutocompletions} from 'utils/index';

const argsSchema: CommandFlags = [...botnetFlagsSchemas.addBot];

const autocomplete = ({flags}: AutocompleteData, args: ScriptArg[]) => {
    const {stash} = getDataStash().dataset;
    const {cache} = JSON.parse(stash as string);
    const botnets = new Map(cache.botnetMap);
    const completionKeys = {
        bot: [
            ...Array.from(botnets && botnets.size ? botnets.keys() : [[]])
        ] as string[],
        ram: [...ramOptions]
    };
    flags(argsSchema);
    return getAutocompletions({args, completionKeys});
};

const addBot = (
    ns: NS,
    {bot, quantity = 1, ram: rams = ramOptions}: BotnetManagerOptions
) => {
    let botnetMap = hydrateBotnetMap(ns, {stash: {id: 'botnetMap', reviver}});
    if (!botnetMap || !botnetMap.size || !(botnetMap instanceof Map)) {
        botnetMap = new Map();
    }
    const botnetName = generateBotnetName(bot as string);
    const ram = Array.isArray(rams) ? (rams as ScriptArg[]).pop() : rams;
    const added: string[] = [];

    for (let i = 0; i < quantity; i += 1) {
        const hostname = ns.purchaseServer(botnetName, ram as number);
        const purchased = !!hostname;
        if (purchased) {
            const member = hostname;
            added.push(member);
            if (!botnetMap.has(botnetName)) {
                botnetMap.set(botnetName, new Set());
            }
            const botnet = botnetMap.get(botnetName);
            const members = botnet ? [...botnet.values()] : [];
            [...members, ...added].map((hostname) => {
                botnet?.add(hostname);
            });
        }
    }

    cacheBotnetMap(ns, {botnetMap});
    return added;
};

const main = async (ns: NS) => {
    const {bot, quantity = 1, ram} = ns.flags(argsSchema);

    return addBot(ns, {bot, quantity, ram});
};

export default addBot;
export {addBot, autocomplete, main};
