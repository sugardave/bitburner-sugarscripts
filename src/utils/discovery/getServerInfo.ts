import {AutocompleteData, NS, ScriptArg} from '@ns';
import {Executor, NetServer} from 'global';
import {commonSchema, getAutocompletions} from 'utils/index';
import {fileLocations, GameFile} from 'utils/io/index';

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

const loadServerCache = (ns: NS, cacheType = 'all') => {
    const {location, suffix} = fileLocations.nmapCache;
    const fileName = `${cacheType}${suffix}`;
    const file = new GameFile(ns, fileName, location);
    const contents = file.read();

    return contents ? JSON.parse(contents) : contents;
};

const getServerInfo: Executor = (ns, {hostname}) => {
    const {getServer} = ns;
    const cache = loadServerCache(ns);
    return cache ? cache[hostname as string] : getServer(hostname);
};

const main = async (ns: NS) => {
    const {flags, getHostname} = ns;
    const {target: hostname = getHostname()} = flags(argsSchema);
    const serverInfo = getServerInfo(ns, {hostname} as NetServer, {});

    return serverInfo;
};

export default main;
export {autocomplete, getServerInfo, main};
