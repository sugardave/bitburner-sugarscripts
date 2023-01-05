import {AutocompleteData, NS, ScriptArg} from '@ns';
import {commonSchema, getAutocompletions} from 'utils/index';
import {CommandFlags, Executor, ExecutorOptions, NetServer} from '/global';

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

const deployFiles: Executor = (
    {scp}: NS,
    {hostname}: NetServer,
    {files, origin = 'home'}: ExecutorOptions
) => {
    return scp(files as string[], hostname as string, origin as string);
};

const main = async (ns: NS) => {
    const {flags} = ns;
    const {file: files, origin, target: hostname} = flags(argsSchema);
    return deployFiles(ns, {hostname} as NetServer, {files, origin});
};

export default main;
export {autocomplete, deployFiles, main};
