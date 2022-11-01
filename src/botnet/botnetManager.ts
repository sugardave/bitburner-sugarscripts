import {AutocompleteData, NS, ScriptArg} from '@ns';
import {BotnetManagerOptions, CommandFlags} from 'global';
import {commonSchema, getAutocompletions} from 'utils/index';
import {
    addBot,
    addBotnet,
    botnetActions,
    botnetMap,
    getBotnetStatus,
    getServerPriceList,
    ramOptions,
    refreshBotnetMap,
    removeBot,
    removeBotnet,
    startAttack,
    stopAttack
} from 'utils/botnet/index';

const botnets = new Map(botnetMap);

const customSchema: CommandFlags = [
    ['action', ''],
    ['bot', ''],
    ['botnet', []],
    ['controller', 'home'],
    ['quantity', 1],
    ['ram', []],
    ['threads', 1]
];
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
    {
        action,
        bot,
        botnet,
        quantity,
        ram,
        target,
        threads = 1
    }: BotnetManagerOptions
) => {
    const {tprint} = ns;

    //refresh botnet map
    refreshBotnetMap(ns);
    switch (action) {
        case 'addBot':
            addBot(ns, {bot, ram});
            break;
        case 'addBotnet':
            addBotnet(ns, {botnet, quantity, ram});
            break;
        case 'checkPricing':
            tprint(getServerPriceList(ns, ram as ScriptArg[]).formatted);
            break;
        case 'getBotnetStatus':
            tprint(getBotnetStatus(ns));
            break;
        case 'removeBot':
            removeBot(ns, {bot});
            break;
        case 'removeBotnet':
            removeBotnet(ns, {botnet});
            break;
        case 'startAttack':
            startAttack(ns, {botnet, target, threads});
            break;
        case 'stopAttack':
            stopAttack(ns, {botnet});
            break;
        default:
            break;
    }
};

const main = async (ns: NS) => {
    const {flags} = ns;

    const {
        action,
        bot,
        botnet,
        controller = 'home',
        quantity = 1,
        ram,
        target,
        threads = 1
    } = flags(argsSchema);
    return manageBotnets(ns, {
        action,
        bot,
        botnet,
        controller,
        quantity,
        ram,
        target,
        threads
    });
};

export default main;
export {autocomplete, main};
