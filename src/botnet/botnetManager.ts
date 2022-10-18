import {AutocompleteData, NS, ScriptArg} from '@ns';
import {BotnetManagerOptions, CommandFlags} from 'global';
import {commonSchema, getAutocompletions} from 'utils/index';
import {
    botnetActions,
    botnetFlagsSchema as customSchema,
    ramOptions
} from 'utils/botnet/index';
import {getServerPriceList} from 'utils/botnet/getServerPriceList';

const managedBotnets = new Map();

const argsSchema: CommandFlags = [...commonSchema, ...customSchema];

const autocomplete = (
    {flags, servers}: AutocompleteData,
    args: ScriptArg[]
) => {
    const completionKeys = {
        action: [...botnetActions],
        botnet: [...Array.from(managedBotnets.keys())],
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
    switch (action) {
        case 'checkPricing':
            tprint(getServerPriceList(ns, ram as ScriptArg[]).formatted);
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
