import {NS} from '@ns';
import {StashElement} from 'global';
import {MapFile} from 'utils/io/index';
import {getDataStash} from 'utils/data/index';

const hydrateMapFromStash = (stash: StashElement) => {
    const {reviver} = stash;
    const {stash: data} = getDataStash(stash).dataset;
    if (!data) {
        return;
    }
    const hydrated = JSON.parse(data, reviver);
    return hydrated;
};

const hydrateMap = (
    ns: NS,
    {name, location}: {name: string; location: string},
    {skipStash = false, stash}: {skipStash: boolean; stash: StashElement}
) => {
    const {reviver} = stash;
    if (!skipStash) {
        hydrateMapFromStash(stash);
    }

    const mapFile = new MapFile(ns, name, location);
    const contents = mapFile.read() || '[]';

    return JSON.parse(contents, reviver);
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

    return hydrateMap(
        ns,
        {name, location} as {name: string; location: string},
        {skipStash, stash} as {skipStash: boolean; stash: StashElement}
    );
};

export default main;
export {hydrateMap, hydrateMapFromStash, main};
