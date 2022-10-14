import {AutocompleteData, NS, ScriptArg} from '@ns';
import {CommandFlags, Executor, ExecutorOptions, NetServer} from 'global';
import {commonSchema, getAutocompletions} from 'utils/index';
import {getServerInfo} from 'utils/discovery/getServerInfo';

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
    {getServer, scp}: NS,
    {hostname}: NetServer,
    {files, origin}: ExecutorOptions
) => {
    const {hasAdminRights} = getServerInfo(
        {getServer} as NS,
        {hostname},
        {}
    ) as NetServer;
    if (hasAdminRights) {
        return scp(files as string[], hostname as string, origin as string);
    }
    return;
};

const main = async (ns: NS) => {
    const {flags, getHostname} = ns;
    const {
        file: files,
        origin = 'home',
        target: hostname = getHostname()
    } = flags(argsSchema);

    return prepTarget(ns, {hostname} as NetServer, {files, origin});
};

export default main;
export {autocomplete, main};
