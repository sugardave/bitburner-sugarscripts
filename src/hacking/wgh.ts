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
    const {grow} = ns;
    await grow(target as string);
};

const hackServer: Executor = async (ns: NS, {hostname: target}: NetServer) => {
    const {hack} = ns;
    await hack(target as string);
};

const weakenServer: Executor = async (
    ns: NS,
    {hostname: target}: NetServer
) => {
    const {weaken} = ns;
    await weaken(target as string);
};

const wgh: Executor = async (ns: NS, {hostname}: NetServer, {once}) => {
    const {
        getServerMaxMoney,
        getServerMoneyAvailable,
        getServerMinSecurityLevel,
        getServerSecurityLevel,
        sleep
    } = ns;
    const secLevelModifier = 5;
    const fundsModifier = 0.75;
    const server = new Server(hostname as string);
    const target = hostname as string;

    const maximumSecurityLevel =
        getServerMinSecurityLevel(target) + secLevelModifier;
    const minimumFundsAvailable = getServerMaxMoney(target) * fundsModifier;

    while (!once) {
        const currentSecurityLevel = getServerSecurityLevel(target);
        const currentFunds = getServerMoneyAvailable(target);
        if (currentSecurityLevel > maximumSecurityLevel) {
            await weakenServer(ns, server, {});
        } else if (currentFunds < minimumFundsAvailable) {
            await growServer(ns, server, {});
        } else {
            await hackServer(ns, server, {});
        }
        await sleep(50);
    }
};

const main = async (ns: NS) => {
    const {flags, getHostname} = ns;
    const {once, target: hostname} = flags([
        ...argsSchema,
        ['target', getHostname()]
    ]);

    return await wgh(ns, {hostname} as NetServer, {once});
};

export default main;
export {autocomplete, growServer, hackServer, weakenServer, main, wgh};
