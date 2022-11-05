import {AutocompleteData, NS, ScriptArg} from '@ns';
import {CommandFlags, Executor, NetServer} from 'global';
import {commonSchema, getAutocompletions} from 'utils/index';
import {fileLocations, MapFile} from 'utils/io/index';

const customSchema: CommandFlags = [['skipCache', false]];
const argsSchema: CommandFlags = [...commonSchema, ...customSchema];

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

const loadServerCache = (ns: NS, cacheType = 'all') => {
    const {location, suffix} = fileLocations.nmap;
    const fileName = `${cacheType}${suffix}`;
    const file = new MapFile(ns, fileName, location);
    const contents = file.read();
    return new Map(contents ? JSON.parse(contents) : []);
};

const getServerInfo: Executor = (ns: NS, {hostname}, {skipCache}) => {
    const {getServer} = ns;
    const cache = !skipCache ? loadServerCache(ns) : new Map([]);
    const serverInfo = cache.size ? cache.get(hostname) : getServer(hostname);

    return serverInfo;
};

const main = async (ns: NS) => {
    const {flags, getHostname} = ns;
    const {skipCache, target: hostname = getHostname()} = flags(argsSchema);
    const serverInfo = getServerInfo(ns, {hostname} as NetServer, {skipCache});

    return serverInfo;
};

export default main;
export {autocomplete, getServerInfo, main};
