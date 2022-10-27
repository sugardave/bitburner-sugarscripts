import {NS} from '@ns';
import {fileLocations} from 'utils/io/index';
import {hydrateMap} from 'utils/hydrateMap';
import {BotnetMap} from 'global';

const hydrateBotnetMap = (
    ns: NS,
    {mapType = 'all', skipStash = false, stashName = 'botnetMap'}
) => {
    const {location, suffix} = fileLocations.botnetMapCache;

    return hydrateMap(
        ns,
        {filename: `${mapType}${suffix}`, location},
        {skipStash, stashName}
    ) as BotnetMap;
};

const main = async (ns: NS) => {
    const {flags} = ns;
    const {mapType, skipStash, stashName} = flags([
        ['mapType', 'all'],
        ['skipStash', false],
        ['stashName', 'botnetMap']
    ]);
    return hydrateBotnetMap(ns, {mapType, skipStash, stashName} as {
        mapType: string;
        skipStash: boolean;
        stashName: string;
    });
};

export default main;
export {hydrateBotnetMap, main};
