import {NS} from '@ns';
import {MapFile} from 'utils/io/index';
import {stashData} from 'utils/data/index';
import {hydrateMap} from 'utils/hydrateMap';

const cacheMap = (
    ns: NS,
    {
        map,
        filename,
        location
    }: {map: Map<string, unknown>; filename: string; location: string},
    {skipStash = false, stashName}: {skipStash: boolean; stashName: string}
) => {
    const mapFile = new MapFile(ns, filename, location);
    const contents = JSON.stringify(Array.from(map.entries()));

    mapFile.write(contents);
    if (!skipStash) {
        stashData({data: contents, stashName});
    }

    return map;
};

const main = async (ns: NS) => {
    const {flags} = ns;
    const {filename, location, skipStash, stashName} = flags([
        ['filename', ''],
        ['location', ''],
        ['skipStash', false],
        ['stashName', '']
    ]);
    const map = hydrateMap(
        ns,
        {filename, location} as {filename: string; location: string},
        {
            skipStash: true, // skip stash for this hydration
            stashName
        } as {skipStash: boolean; stashName: string}
    );

    return cacheMap(
        ns,
        {map, filename, location} as {
            map: Map<string, unknown>;
            filename: string;
            location: string;
        },
        {skipStash, stashName} as {skipStash: boolean; stashName: string}
    );
};

export default main;
export {cacheMap, main};
