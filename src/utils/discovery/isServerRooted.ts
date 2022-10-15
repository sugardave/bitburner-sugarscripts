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
const isServerRooted: Executor = (ns: NS, server: NetServer) => {
    const {flags, getHostname} = ns;
    const {target} = flags([...argsSchema, ['target', getHostname()]]);
    const hostname = server.hostname ? server.hostname : (target as string);
    const {hasAdminRights} = getServerInfo(ns) as NetServer;

    ns.tprint(`${hostname} is${!hasAdminRights ? ' not' : ''} rooted`);
    return hasAdminRights;
};

const main = async (ns: NS) => isServerRooted(ns, {});

export default main;
export {autocomplete, main};
