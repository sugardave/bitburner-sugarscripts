import {AutocompleteData, NS, ScriptArg} from '@ns';
import {Executor, NetServer} from 'global';
import {commonSchema, getAutocompletions} from 'utils/index';

const argsSchema = [...commonSchema];

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

const getServer: Executor = (ns: NS, {hostname}: NetServer) => {
    // TODO: check for nmap saved file "all-servers.txt" first and return information from there if possible
    return ns.getServer(hostname);
};

const getServerInfo = (ns: NS) => {
    const {flags, getHostname} = ns;
    const {target} = flags([...argsSchema, ['target', getHostname()]]);
    const hostname = target as string;
    const serverInfo = getServer(ns, {hostname});
    return serverInfo as NetServer;
};

const main = async (ns: NS) => getServerInfo(ns);

export default main;
export {autocomplete, getServerInfo, main};
