import {NS, ScriptArg} from '@ns';

import {Executor, CommandFlags, NetServer, ServerMapEntry} from 'global';
import {GameFile} from 'utils/io/GameFile';
import {omniscan} from 'utils/discovery/omniscan';
import {getAutocompletions} from 'utils/index';

class MapFile extends GameFile {
    constructor(ns: NS, name: string, location = '/trove/maps') {
        // set static member for class GameFile to this ns instance
        GameFile.ns = ns;
        super(name, location);
    }
}

type NetServerMap = {
    map: ServerMapEntry;
    file: MapFile;
};

type NetServerMaps = {
    [key: string]: NetServerMap;
};

const customSchema: CommandFlags = [['rescan', false]];
const argsSchema: CommandFlags = [...customSchema];

const autocomplete = ({flags}: NS, args: ScriptArg[]) => {
    flags(argsSchema);
    return getAutocompletions({args});
};

const serverMaps: NetServerMaps = {};

const hydrateServerMap = ({map, file}: NetServerMap) => {
    map.clear();
    if (file instanceof MapFile) {
        JSON.parse(file.read()).map(
            ([key, value]: [key: string, value: NetServer]) => {
                map.set(key, value);
            }
        );
    }
    return map;
};

const addToMap: Executor = (ns: NS, server: NetServer) => {
    const {getHostname, getServer} = ns;
    const {hostname = getHostname(), ...rest} = server;
    const serverInfo = Object.assign(getServer(hostname), {...rest});
    if (!serverMaps.all.map.has(hostname)) {
        serverMaps.all.map.set(hostname, serverInfo);
    }
    return serverMaps.all.map.get(hostname);
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
    initializeMapGroups(ns);

    if (rescan) {
        // refresh/build Map of servers
        omniscan(ns, {executor: addToMap});
        if (serverMaps.all.file instanceof MapFile) {
            // write allServersMap to file
            serverMaps.all.file.write(JSON.stringify([...serverMaps.all.map]));
        }

        // TODO: process owned/pwned servers into their respective ServerMap and MapFile
    } else {
        if (serverMaps.all.file instanceof MapFile) {
            if (MapFile.exists(serverMaps.all.file.getFilePath())) {
                // hydrate
                hydrateServerMap(serverMaps.all);
            } else {
                tprint(
                    `hydration failed, run mapper again with --rescan option`
                );
            }
        }
    }
};

const main = async (ns: NS) => mapServers(ns);

export default main;
export {autocomplete, main};
