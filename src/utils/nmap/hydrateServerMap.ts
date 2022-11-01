import {NS} from '@ns';
import {MapFile} from 'utils/io/MapFile';
import {hydrateMap} from 'utils/hydrateMap';
import {fileLocations} from 'utils/io/index';

const hydrateServerMap = (
    ns: NS,
    file: MapFile,
    {skipStash = false, stashName}: {skipStash: boolean; stashName: string}
) => {
    const contents = hydrateMap(ns, file, {
        skipStash,
        stashName
    });
    const botnetMap = new Map(JSON.parse(contents));

    return botnetMap;
};

const main = async (ns: NS) => {
    const {flags} = ns;

    const {
        file,
        location = fileLocations.nmapCache.location,
        skipStash = false,
        stashName = 'nmapCache'
    } = flags([
        ['file', ''],
        ['location', '']
    ]);
    return hydrateServerMap(
        ns,
        new MapFile(ns, file as string, location as string),
        {skipStash, stashName} as {skipStash: boolean; stashName: string}
    );
};

export default main;
export {hydrateServerMap, main};
