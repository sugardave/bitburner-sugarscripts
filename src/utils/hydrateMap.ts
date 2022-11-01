import {NS} from '@ns';
import {MapFile} from 'utils/io/index';
import {stashData} from 'utils/data/index';

const hydrateMap = (
    ns: NS,
    {name, location}: {name: string; location: string},
    {skipStash = false, stashName}: {skipStash: boolean; stashName: string}
) => {
    const mapFile = new MapFile(ns, name, location);
    const contents = mapFile.read() || '[]';

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

    return hydrateMap(
        ns,
        {name, location} as {name: string; location: string},
        {skipStash, stashName} as {skipStash: boolean; stashName: string}
    );
};

export default main;
export {hydrateMap, main};
