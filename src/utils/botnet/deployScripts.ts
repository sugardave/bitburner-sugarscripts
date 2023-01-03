import {NS} from '@ns';
import {deployFiles} from 'utils/hacking/deployFiles';
import {commonSchema} from 'utils/index';
import {CommandFlags, Executor, ExecutorOptions, NetServer} from 'global';

const argsSchema: CommandFlags = [...commonSchema];

const deployScripts: Executor = (
    ns: NS,
    {hostname}: NetServer,
    {origin = 'home'}: ExecutorOptions
) => {
    const files = [
        '/hacking/wgh.js',
        '/utils/index.js',
        '/utils/commonSchema.js',
        '/utils/getAutocompletions.js'
    ];
    return deployFiles(ns, {hostname}, {files, origin});
};

const main = async (ns: NS) => {
    const {origin = 'home', target: hostname} = ns.flags(argsSchema);
    return deployScripts(ns, {hostname} as NetServer, {origin});
};

export default main;
export {deployScripts, main};
