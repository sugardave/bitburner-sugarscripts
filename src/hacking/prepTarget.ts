import {AutocompleteData, NS, ScriptArg} from '@ns';
import {CommandFlags, Executor, ExecutorOptions, NetServer} from 'global';
import {commonSchema, getAutocompletions} from 'utils/index';
import {getServerInfo} from 'utils/discovery/getServerInfo';
import {deployFiles} from 'utils/hacking/deployFiles';

const customSchema: CommandFlags = [
    ['file', []],
    ['origin', 'home']
];
const argsSchema: CommandFlags = [...commonSchema, ...customSchema];

const autocomplete = (
    {flags, servers, scripts}: AutocompleteData,
    args: ScriptArg[]
) => {
    const completionKeys = {
        file: [...scripts],
        origin: [...servers],
        target: [...servers]
    };
    flags(argsSchema);
    return getAutocompletions({args, completionKeys});
};

const prepTarget: Executor = (
    ns: NS,
    {hostname}: NetServer,
    {files, origin}: ExecutorOptions
) => {
    const {hasAdminRights} = getServerInfo(ns, {hostname}, {}) as NetServer;
    if (hasAdminRights) {
        return deployFiles(ns, {hostname} as NetServer, {files, origin});
    }
    return;
};

const main = async (ns: NS) => {
    const {
        file: files,
        origin = 'home',
        target: hostname = ns.getHostname()
    } = ns.flags(argsSchema);

    return deployFiles(ns, {hostname} as NetServer, {files, origin});
};

export default main;
export {autocomplete, main, prepTarget};
