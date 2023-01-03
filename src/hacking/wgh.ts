import {AutocompleteData, NS} from '@ns';
import {
    AutocompletionArgs,
    Autocompletions,
    CommandFlags,
    Executor,
    NetServer
} from 'global';
import {Server} from 'utils/index';
import {commonSchema} from 'utils/commonSchema';
import {getAutocompletions} from 'utils/getAutocompletions';

const customSchema: CommandFlags = [['once', false]];
const argsSchema: CommandFlags = [...commonSchema, ...customSchema];

const autocomplete = (
    {flags, servers}: AutocompleteData,
    args: AutocompletionArgs
) => {
    const completionKeys: Autocompletions = {
        target: [...servers]
    };
    flags(argsSchema);
    return getAutocompletions({args, completionKeys});
};

const growServer: Executor = async (ns: NS, {hostname: target}: NetServer) => {
    await ns.grow(target as string);
};

const hackServer: Executor = async (ns: NS, {hostname: target}: NetServer) => {
    await ns.hack(target as string);
};

const weakenServer: Executor = async (
    ns: NS,
    {hostname: target}: NetServer
) => {
    await ns.weaken(target as string);
};

const wgh: Executor = async (ns: NS, {hostname}: NetServer, {once}) => {
    const secLevelModifier = 5;
    const fundsModifier = 0.75;
    const server = new Server(hostname as string);
    const target = hostname as string;

    const maximumSecurityLevel =
        ns.getServerMinSecurityLevel(target) + secLevelModifier;
    const minimumFundsAvailable = ns.getServerMaxMoney(target) * fundsModifier;

    while (!once) {
        const currentSecurityLevel = ns.getServerSecurityLevel(target);
        const currentFunds = ns.getServerMoneyAvailable(target);
        if (currentSecurityLevel > maximumSecurityLevel) {
            await weakenServer(ns, server, {});
        } else if (currentFunds < minimumFundsAvailable) {
            await growServer(ns, server, {});
        } else {
            await hackServer(ns, server, {});
        }
        await ns.sleep(50);
    }
};

const main = async (ns: NS) => {
    const {once, target: hostname} = ns.flags([
        ...argsSchema,
        ['target', ns.getHostname()]
    ]);

    return await wgh(ns, {hostname} as NetServer, {once});
};

export default main;
export {autocomplete, growServer, hackServer, weakenServer, main, wgh};
