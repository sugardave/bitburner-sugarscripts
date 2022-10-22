import {AutocompleteData, NS, ScriptArg} from '@ns';
import {BotnetManagerOptions, CommandFlags} from 'global';
import {commonSchema, getAutocompletions} from 'utils/index';
import {
    botnetActions,
    botnetFlagsSchema as customSchema,
    botnetMap,
    ramOptions
} from 'utils/botnet/index';
import {getServerPriceList} from 'utils/botnet/getServerPriceList';
import {fileLocations, MapFile} from 'utils/io/index';

const botnets = new Map(botnetMap);

const argsSchema: CommandFlags = [...commonSchema, ...customSchema];

const autocomplete = (
    {flags, servers}: AutocompleteData,
    args: ScriptArg[]
) => {
    const completionKeys = {
        action: [...botnetActions],
        botnet: [...Array.from(botnets.keys())],
        controller: [...servers],
        ram: [...ramOptions],
        target: [...servers]
    };
    flags(argsSchema);
    return getAutocompletions({args, completionKeys});
};

const manageBotnets = (
    ns: NS,
    {action, bot, botnet, controller, quantity, ram}: BotnetManagerOptions
) => {
    const {tprint} = ns;
    hydrateBotnetMap(ns);
    switch (action) {
        case 'addBot':
            break;
        case 'addBotnet':
            break;
        case 'checkPricing':
            tprint(getServerPriceList(ns, ram as ScriptArg[]).formatted);
            break;
        case 'getBotnetStatus':
            break;
        case 'removeBot':
            break;
        case 'removeBotnet':
            break;
        default:
            break;
    }
};

const main = async (ns: NS) => {
    const {flags} = ns;

    const {action, bot, botnet, controller, quantity, ram} = flags(argsSchema);
    return manageBotnets(ns, {action, bot, botnet, controller, quantity, ram});
};

export default main;
export {autocomplete, main};
