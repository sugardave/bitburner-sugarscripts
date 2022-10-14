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

// TODO: check for nmap saved file "all-servers.txt" first and return information from there if possible
const getServerInfo: Executor = ({getServer}, {hostname}) =>
    getServer(hostname);

const main = async (ns: NS) => {
    const {flags, getHostname} = ns;
    const {target: hostname = getHostname()} = flags(argsSchema);
    const serverInfo = getServerInfo(ns, {hostname} as NetServer, {});

    return serverInfo;
};

export default main;
export {autocomplete, getServerInfo, main};
