import {NS} from '@ns';
import {NetServerMap, NetServerStashElement} from 'global';
import {fileLocations} from 'utils/io/index';
import {hydrateServerMap} from 'utils/nmap/hydrateServerMap';
import {nmapReplacer as replacer} from 'utils/nmap/nmapReplacer';
import {cacheMap} from 'utils/cacheMap';

const cacheServerMap = (
    ns: NS,
    {
        nmap,
        mapType = 'all',
        skipStash = false,
        stash = {id: 'nmap', replacer}
    }: {
        nmap: NetServerMap;
        mapType?: string;
        skipStash?: boolean;
        stash?: NetServerStashElement;
    }
) => {
    const {location, suffix} = fileLocations.nmap;

    return cacheMap(
        ns,
        {
            data: Array.from(nmap.entries()),
            name: `${mapType}${suffix}`,
            location
        },
        {skipStash, stash}
    );
};

const main = async (ns: NS) => {
    const stash: NetServerStashElement = {
        id: 'nmap',
        replacer
    };
    const nmap = hydrateServerMap(ns, {
        mapType: 'all',
        stash
    });

    return cacheServerMap(ns, {nmap, mapType: 'all', stash} as {
        nmap: NetServerMap;
        mapType: string;
        stash: NetServerStashElement;
    });
};

export default main;
export {cacheServerMap as cacheBotnetMap, main};
