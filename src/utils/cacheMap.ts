import {NS} from '@ns';
import {MapFile} from 'utils/io/index';
import {stashData} from 'utils/data/index';
import {hydrateMap} from 'utils/hydrateMap';

const cacheMap = (
    ns: NS,
    {
        contents,
        name,
        location
    }: {
        contents: string;
        name: string;
        location: string;
    },
    {skipStash = false, stashName}: {skipStash: boolean; stashName: string}
) => {
    const mapFile = new MapFile(ns, name, location);

    mapFile.write(contents);
    if (!skipStash) {
        stashData({data: contents, stashName});
    }

    return contents;
};

const main = async (ns: NS) => {
    const {flags} = ns;
    const {
        filename: name,
        location,
        skipStash,
        stashName
    } = flags([
        ['filename', ''],
        ['location', ''],
        ['skipStash', false],
        ['stashName', '']
    ]);
    const contents = hydrateMap(
        ns,
        {name, location} as {name: string; location: string},
        {
            skipStash: true, // skip stash for this hydration
            stashName
        } as {skipStash: boolean; stashName: string}
    );

    return cacheMap(
        ns,
        {contents, name, location} as {
            contents: string;
            name: string;
            location: string;
        },
        {skipStash, stashName} as {skipStash: boolean; stashName: string}
    );
};

export default main;
export {cacheMap, main};
