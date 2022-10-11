import {AutocompleteData, NS, ScriptArg} from '@ns';
import {CommandFlags, Executor, NetServer} from 'global';
import {commonSchema, getAutocompletions} from 'utils/index';
import {makeFileList} from 'utils/io/GameFileList';
import {getServerInfo} from 'utils/discovery/getServerInfo';

const customSchema: CommandFlags = [
    ['file', []],
    ['origin', 'home']
];
const argsSchema: CommandFlags = [...commonSchema, ...customSchema];

const autocomplete = (
    {flags, servers}: AutocompleteData,
    args: ScriptArg[]
) => {
    const fileArgs = [...args].map((arg, i, arr) => {
        console.log(`arg ${arg}`);
        if (arg.toString() === `--file`) {
            const file = arr[i + 1];
            return file ? file : undefined;
        }
        return [];
    });
    const completionKeys = {
        file: makeFileList(fileArgs as string[]) as string[],
        origin: servers,
        target: servers
    };
    flags(argsSchema);
    return getAutocompletions({args, completionKeys});
};

const prepTarget: Executor = async (ns: NS, server: NetServer) => {
    const {flags, getHostname, scp} = ns;
    const {
        file: files,
        origin,
        target
    } = flags([...argsSchema, ['target', getHostname()]]);
    const hostname = server.hostname ? server.hostname : (target as string);
    const {hasAdminRights} = getServerInfo(ns) as NetServer;

    if (hasAdminRights) {
        scp(files as string[], hostname, origin as string);
    }
};

const main = async (ns: NS) => await prepTarget(ns, {});

export default main;
export {autocomplete, main};
