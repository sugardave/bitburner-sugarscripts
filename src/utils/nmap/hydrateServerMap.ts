import {NS} from '@ns';
import {ServerMapEntry} from 'global';
import {MapFile} from 'utils/io/MapFile';
import {hydrateMap} from 'utils/hydrateMap';

type NetServerMap = {
    file: MapFile;
    map: ServerMapEntry;
};

const hydrateServerMap = (
    ns: NS,
    {file, map}: NetServerMap,
    {skipStash = false, stashName}: {skipStash: boolean; stashName: string}
) => {
    let clone = new Map(map) as Map<string, ServerMapEntry>;
    if (file instanceof MapFile) {
        clone = hydrateMap(ns, file, {
            skipStash,
            stashName
        }) as Map<string, ServerMapEntry>;
    }

    return clone;
};

const main = async (ns: NS) => {
    const {flags} = ns;

    const {
        filename,
        location,
        skipStash = false,
        stashName = 'nmapCache'
    } = flags([
        ['filename', ''],
        ['location', '']
    ]);
    return hydrateServerMap(
        ns,
        {file: {name: filename, location} as MapFile, map: new Map()},
        {skipStash, stashName} as {skipStash: boolean; stashName: string}
    );
};

export default main;
export {hydrateServerMap, main, NetServerMap};
