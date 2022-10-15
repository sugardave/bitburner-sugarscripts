import {AutocompleteData, NS, ScriptArg} from '@ns';
import {CommandFlags, Executor, NetServer} from 'global';
import {commonSchema, getAutocompletions} from 'utils/index';
import {getServerInfo} from 'utils/discovery/index';

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
const isPlayerOwned: Executor = (ns: NS, {hostname}: NetServer) => {
    const {purchasedByPlayer} = getServerInfo(
        ns,
        {hostname} as NetServer,
        {}
    ) as NetServer;

    return purchasedByPlayer;
};

const main = async (ns: NS) => {
    const {flags, getHostname} = ns;
    const {target: hostname = getHostname()} = flags(argsSchema);
    return isPlayerOwned(ns, {hostname} as NetServer, {});
};

export default main;
export {autocomplete, isPlayerOwned, main};
