import {NS} from '@ns';
import {MapFile} from 'utils/io/index';
import {stashData} from 'utils/data/index';

const hydrateMap = (
    ns: NS,
    {filename, location}: {filename: string; location: string},
    {skipStash = false, stashName}: {skipStash: boolean; stashName: string}
) => {
    const mapFile = new MapFile(ns, filename, location);
    const contents = mapFile.read() || '[]';

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

    return hydrateMap(
        ns,
        {filename, location} as {filename: string; location: string},
        {skipStash, stashName} as {skipStash: boolean; stashName: string}
    );
};

export default main;
export {hydrateMap, main};
