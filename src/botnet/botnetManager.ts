import {AutocompleteData, NS, ScriptArg} from '@ns';
import {BotnetManagerOptions, CommandFlags} from 'global';
import {commonSchema, getAutocompletions} from 'utils/index';
import {
    addBot,
    addBotnet,
    botnetActions,
    getBotnetStatus,
    getServerPriceList,
    hydrateBotnetMapFromStash,
    ramOptions,
    refreshBotnetMap,
    removeBot,
    removeBotnet,
    startAttack,
    stopAttack
} from 'utils/botnet/index';

const botnetMap = hydrateBotnetMapFromStash();

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
    const botnets: string[] = Array.from(botnetMap.keys());
    const completionKeys = {
        action: [...botnetActions],
        botnet: [...botnets],
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
            ns.tprint(getServerPriceList(ns, ram as ScriptArg[]).formatted);
            break;
        case 'getBotnetStatus':
            ns.tprint(getBotnetStatus(ns));
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
    const {
        action,
        bot,
        botnet,
        controller = 'home',
        quantity = 1,
        ram,
        target,
        threads = 1
    } = ns.flags(argsSchema);
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
