import {NS} from '@ns';
import {NetServerMap, NetServerStashElement} from 'global';
import {hydrateMap, hydrateMapFromStash} from 'utils/hydrateMap';
import {fileLocations} from 'utils/io/index';
import {nmapReviver as reviver} from 'utils/nmap/nmapReviver';

const hydrateServerMapFromStash = () => {
    const nmap = hydrateMapFromStash({id: 'nmap', reviver});
    return nmap ? nmap : new Map();
};

const hydrateServerMap = (
    ns: NS,
    {
        mapType = 'all',
        skipStash = false,
        stash = {id: 'nmap', reviver} as NetServerStashElement
    }
): NetServerMap => {
    const {location, suffix} = fileLocations.nmap;
    const nmap = hydrateMap(
        ns,
        {name: `${mapType}${suffix}`, location},
        {skipStash, stash}
    );

    return nmap;
};

const main = async (ns: NS) => {
    const stash: NetServerStashElement = {id: 'nmap', reviver};
    return hydrateServerMap(ns, {mapType: 'all', stash});
};

export default main;
export {hydrateServerMap, hydrateServerMapFromStash, main};
