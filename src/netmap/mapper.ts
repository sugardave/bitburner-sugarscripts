import {NS, ScriptArg} from '@ns';
import {Executor, CommandFlags, NetServer, NetServerMap} from 'global';
import {omniscan} from 'discovery/omniscan';
import {getAutocompletions} from 'utils/index';
import {isPlayerOwned, isServerRooted} from 'utils/discovery/index';
import {fileLocations, MapFile} from 'utils/io/index';
import {
    hydrateServerMap,
    nmapReplacer as replacer,
    nmapReviver as reviver
} from 'utils/nmap/index';

type NetServerMaps = {
    [mapType: string]: {
        file: MapFile | undefined;
        fileInfo: {filename: MapFile['name']; location: MapFile['location']};
        map: NetServerMap;
    };
};

const {location, suffix} = fileLocations.nmap;

const serverMaps: NetServerMaps = {
    all: {
        file: undefined,
        fileInfo: {filename: `all${suffix}`, location},
        map: new Map()
    },
    owned: {
        file: undefined,
        fileInfo: {filename: `owned${suffix}`, location},
        map: new Map()
    },
    pwned: {
        file: undefined,
        fileInfo: {filename: `pwned${suffix}`, location},
        map: new Map()
    }
};

const customSchema: CommandFlags = [['rescan', false]];
const argsSchema: CommandFlags = [...customSchema];

const autocomplete = ({flags}: NS, args: ScriptArg[]) => {
    flags(argsSchema);
    return getAutocompletions({args});
};

const addToMap: Executor = (ns: NS, server: NetServer) => {
    const {hostname = ns.getHostname(), ...rest} = server;
    const {all, owned, pwned} = serverMaps;
    const serverInfo = Object.assign(ns.getServer(hostname), {
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
        const map = serverMaps[group];
        if (!map.file) {
            const {
                fileInfo: {filename, location}
            } = map;
            map.file = new MapFile(ns, filename, location);
        }
    }
};

const mapServers = (ns: NS) => {
    const {rescan} = ns.flags(argsSchema);
    const serverGroups = ['all', 'owned', 'pwned'];
    initializeMapGroups(ns);
    if (rescan) {
        omniscan(ns, {executor: addToMap});
        for (const group of serverGroups) {
            const {file, map} = serverMaps[group];
            file && file.write(JSON.stringify(map, replacer));
        }
    } else {
        for (const group of serverGroups) {
            const {file, map} = serverMaps[group];
            if (file && MapFile.exists(file.getFilePath())) {
                hydrateServerMap(ns, {
                    skipStash: false,
                    stash: {id: 'nmap', reviver}
                });
            }
            if (group === 'all' && !map.size) {
                ns.tprint(
                    `hydration failed, run mapper again with --rescan option`
                );
                break;
            }
        }
    }
};

const main = async (ns: NS) => mapServers(ns, ns.flags(argsSchema));

export default main;
export {autocomplete, main};
