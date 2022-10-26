import {AutocompleteData, NS} from '@ns';
import {
    AutocompletionArgs,
    Autocompletions,
    CommandFlags,
    Executor,
    NetServer
} from 'global';
import {commonSchema, getAutocompletions, Server} from 'utils/index';

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

const wgh = async (ns: NS) => {
    const {
        flags,
        getHostname,
        getServerMaxMoney,
        getServerMoneyAvailable,
        getServerMinSecurityLevel,
        getServerSecurityLevel,
        sleep
    } = ns;
    const {once, target: hostname} = flags([
        ...argsSchema,
        ['target', getHostname()]
    ]);
    const secLevelModifier = 5;
    const fundsModifier = 0.75;
    const server = new Server(hostname as string);
    const target: string = server.hostname as string;

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

const main = async (ns: NS) => await wgh(ns);

export default main;
export {autocomplete, main};
