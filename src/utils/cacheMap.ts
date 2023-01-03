import {NS} from '@ns';
import {MapFile} from 'utils/io/index';
import {StashElement} from 'global';
import {stashData} from 'utils/data/index';
import {hydrateMap} from 'utils/hydrateMap';

const cacheMap = (
    ns: NS,
    {
        data,
        name,
        location
    }: {
        data: unknown;
        name: string;
        location: string;
    },
    {skipStash = false, stash}: {skipStash: boolean; stash: StashElement}
) => {
    const {replacer} = stash;
    const mapFile = new MapFile(ns, name, location);
    const stringified = JSON.stringify(data, replacer);

    mapFile.write(stringified);
    if (!skipStash) {
        stashData({data, stash});
    }

    return data;
};

const main = async (ns: NS) => {
    const {
        filename: name,
        location,
        skipStash,
        stashName: id
    } = ns.flags([
        ['filename', ''],
        ['location', ''],
        ['skipStash', false],
        ['stashName', '']
    ]);
    const stash = {id};
    const data = hydrateMap(
        ns,
        {name, location} as {name: string; location: string},
        {
            skipStash: true, // skip stash for this hydration
            stash
        } as {skipStash: boolean; stash: StashElement}
    );

    return cacheMap(
        ns,
        {data, name, location} as {
            data: unknown;
            name: string;
            location: string;
        },
        {skipStash, stash} as {skipStash: boolean; stash: StashElement}
    );
};

export default main;
export {cacheMap, main};
