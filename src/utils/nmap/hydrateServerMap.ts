import {NS} from '@ns';
import {NetServerStashElement} from 'global';
import {MapFile} from 'utils/io/MapFile';
import {hydrateMap} from 'utils/hydrateMap';
import {fileLocations} from 'utils/io/index';

const hydrateServerMap = (
    ns: NS,
    file: MapFile,
    {skipStash = false, stashName: id}: {skipStash: boolean; stashName: string}
) => {
    const stash: NetServerStashElement = {id};
    const botnetMap = hydrateMap(ns, file, {
        skipStash,
        stash
    });

    return botnetMap;
};

const main = async (ns: NS) => {
    const {flags} = ns;

    const {
        file,
        location = fileLocations.nmap.location,
        skipStash = false,
        stashName = 'nmap'
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
