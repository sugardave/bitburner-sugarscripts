import {AutocompleteData, NS, ScriptArg} from '@ns';
import {Botnet, BotnetManagerOptions, BotnetMap, CommandFlags} from 'global';
import {botnetFlagsSchemas} from 'utils/botnet/botnetFlagsSchemas';
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
        bot: [...Array.from(botnets.keys())] as string[],
        ram: [...ramOptions]
    };
    flags(argsSchema);
    return getAutocompletions({args, completionKeys});
};

const addBot = (
    ns: NS,
    {bot, quantity = 1, ram: rams = ramOptions}: BotnetManagerOptions
) => {
    const {purchaseServer} = ns;
    const botnetMap = hydrateBotnetMap(ns);
    const botnetName = generateBotnetName(bot as string);
    const ram = Array.isArray(rams) ? (rams as ScriptArg[]).pop() : rams;
    const added = [];

    for (let i = 0; i < quantity; i += 1) {
        const hostname = purchaseServer(botnetName as string, ram as number);
        const purchased = !!hostname;
        if (purchased) {
            const member = {hostname, memberOf: botnetName};
            const {members = []} = botnetMap.get(botnetName) as Botnet;
            added.push(member);
            botnetMap.set(botnetName, {
                name: botnetName,
                members: [...members, ...added]
            });
        }
    }

    cacheBotnetMap(ns, botnetMap as BotnetMap);
    return added;
};

const main = async (ns: NS) => {
    const {flags} = ns;
    const {bot, quantity = 1, ram} = flags(argsSchema);

    return addBot(ns, {bot, quantity, ram});
};

export default addBot;
export {addBot, autocomplete, main};
