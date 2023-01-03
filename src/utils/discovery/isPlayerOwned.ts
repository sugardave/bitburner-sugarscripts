import {AutocompleteData, NS, ScriptArg} from '@ns';
import {CommandFlags, Executor, NetServer} from 'global';
import {commonSchema, getAutocompletions} from 'utils/index';

const argsSchema: CommandFlags = [...commonSchema];

const autocomplete = (
    {flags, servers}: AutocompleteData,
    args: ScriptArg[]
) => {
    const completionKeys = {
        target: [...servers]
    };
    flags(argsSchema);
    return getAutocompletions({args, completionKeys});
};

const isPlayerOwned: Executor = (ns: NS, {hostname}) =>
    ns.getServer(hostname).purchasedByPlayer;

const main = async (ns: NS) => {
    const {target: hostname = ns.getHostname()} = ns.flags(argsSchema);
    return isPlayerOwned(ns, {hostname} as NetServer, {});
};

export default main;
export {autocomplete, isPlayerOwned, main};
