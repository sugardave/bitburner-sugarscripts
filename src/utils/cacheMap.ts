import {NS} from '@ns';
import {MapFile} from 'utils/io/index';
import {stashData} from 'utils/data/index';
import {hydrateMap} from 'utils/hydrateMap';

const cacheMap = (
    ns: NS,
    {
        contents,
        filename,
        location
    }: {
        contents: string;
        filename: string;
        location: string;
    },
    {skipStash = false, stashName}: {skipStash: boolean; stashName: string}
) => {
    const mapFile = new MapFile(ns, filename, location);

    mapFile.write(contents);
    if (!skipStash) {
        stashData({data: contents, stashName});
    }

    return contents;
};

const main = async (ns: NS) => {
    const {flags} = ns;
    const {filename, location, skipStash, stashName} = flags([
        ['filename', ''],
        ['location', ''],
        ['skipStash', false],
        ['stashName', '']
    ]);
    const contents = hydrateMap(
        ns,
        {filename, location} as {filename: string; location: string},
        {
            skipStash: true, // skip stash for this hydration
            stashName
        } as {skipStash: boolean; stashName: string}
    );

    return cacheMap(
        ns,
        {contents, filename, location} as {
            contents: string;
            filename: string;
            location: string;
        },
        {skipStash, stashName} as {skipStash: boolean; stashName: string}
    );
};

export default main;
export {cacheMap, main};
