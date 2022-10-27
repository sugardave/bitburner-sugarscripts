import {NS, ScriptArg} from '@ns';
import {Executor, CommandFlags, NetServer} from 'global';
import {omniscan} from 'discovery/omniscan';
import {getAutocompletions} from 'utils/index';
import {isPlayerOwned, isServerRooted} from 'utils/discovery/index';
import {MapFile} from 'utils/io/index';
import {hydrateServerMap, NetServerMap} from 'utils/nmap/hydrateServerMap';

type NetServerMaps = {
    [key: string]: NetServerMap;
};

const serverMaps: NetServerMaps = {};

const customSchema: CommandFlags = [['rescan', false]];
const argsSchema: CommandFlags = [...customSchema];

const autocomplete = ({flags}: NS, args: ScriptArg[]) => {
    flags(argsSchema);
    return getAutocompletions({args});
};

const addToMap: Executor = (ns: NS, server: NetServer) => {
    const {getHostname, getServer} = ns;
    const {hostname = getHostname(), ...rest} = server;
    const {all, owned, pwned} = serverMaps;
    const serverInfo = Object.assign(getServer(hostname), {
        ...rest,
        _cached: Date.now()
    });
    if (!all.map.has(hostname)) {
        all.map.set(hostname, serverInfo);
    }
    if (isPlayerOwned(ns, server, {}) && !owned.map.has(hostname)) {
        owned.map.set(hostname, serverInfo);
    } else if (
        isServerRooted(ns, server, {}) &&
        !owned.map.has(hostname) &&
        !pwned.map.has(hostname)
    ) {
        pwned.map.set(hostname, serverInfo);
    }
    return all.map.get(hostname);
};

const initializeMapGroups = (ns: NS, groups = ['all', 'owned', 'pwned']) => {
    for (const group of groups) {
        serverMaps[group] = {
            map: new Map(),
            file: new MapFile(ns, `${group}-servers.txt`)
        };
    }
};

const mapServers = (ns: NS) => {
    const {flags, tprint} = ns;
    const {rescan} = flags(argsSchema);
    const serverGroups = ['all', 'owned', 'pwned'];
    initializeMapGroups(ns);
    if (rescan) {
        omniscan(ns, {executor: addToMap});
        for (const group of serverGroups) {
            const {file, map} = serverMaps[group];
            file.write(JSON.stringify([...map]));
        }
    } else {
        for (const group of serverGroups) {
            const {file, map} = serverMaps[group];
            if (MapFile.exists(file.getFilePath())) {
                hydrateServerMap(
                    ns,
                    {map, file},
                    {skipStash: false, stashName: 'nmapCache'}
                );
            }
            if (group === 'all' && !map.size) {
                tprint(
                    `hydration failed, run mapper again with --rescan option`
                );
                break;
            }
        }
    }
};

const main = async (ns: NS) => mapServers(ns);

export default main;
export {autocomplete, main};
