import {AutocompleteData, NS, ScriptArg} from '@ns';
import {CommandFlags, Executor, NetServer} from 'global';
import {commonSchema, getAutocompletions} from 'utils/index';
import {getServerInfo} from 'utils/discovery/getServerInfo';

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
const isServerRooted: Executor = (ns: NS, {hostname}: NetServer) => {
    const {hasAdminRights} = getServerInfo(
        ns,
        {hostname} as NetServer,
        {}
    ) as NetServer;

    return hasAdminRights;
};

const main = async (ns: NS) => {
    const {flags, getHostname} = ns;
    const {target: hostname = getHostname()} = flags(argsSchema);
    return isServerRooted(ns, {hostname} as NetServer, {});
};

export default main;
export {autocomplete, main};
