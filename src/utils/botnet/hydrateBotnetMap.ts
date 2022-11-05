import {NS} from '@ns';
import {BotnetMap, BotnetStashElement} from 'global';
import {fileLocations} from 'utils/io/index';
import {hydrateMap, hydrateMapFromStash} from 'utils/hydrateMap';
import {botnetReviver as reviver} from 'utils/botnet/botnetReviver';

const hydrateBotnetMapFromStash = () => {
    const botnetMap = hydrateMapFromStash({id: 'botnetMap', reviver});
    return botnetMap ? botnetMap : new Map();
};

const hydrateBotnetMap = (
    ns: NS,
    {
        mapType = 'all',
        skipStash = false,
        stash = {id: 'botnetMap', reviver} as BotnetStashElement
    }
): BotnetMap => {
    const {location, suffix} = fileLocations.botnetMap;
    const botnetMap = hydrateMap(
        ns,
        {name: `${mapType}${suffix}`, location},
        {skipStash, stash}
    );

    return botnetMap;
};

const main = async (ns: NS) => {
    const stash: BotnetStashElement = {id: 'botnetMap', reviver};
    return hydrateBotnetMap(ns, {mapType: 'all', stash} as {
        mapType: string;
        stash: BotnetStashElement;
    });
};

export default main;
export {hydrateBotnetMap, hydrateBotnetMapFromStash, main};
