import {NS} from '@ns';
import {fileLocations} from 'utils/io/index';
import {hydrateMap} from 'utils/hydrateMap';
import {BotnetMap} from '/global';

const hydrateBotnetMap = (
    ns: NS,
    {mapType = 'all', skipStash = false, stashName = 'botnetMap'}
): BotnetMap => {
    const {location, suffix} = fileLocations.botnetMapCache;
    const contents = hydrateMap(
        ns,
        {name: `${mapType}${suffix}`, location},
        {skipStash, stashName}
    );
    const parsed = JSON.parse(contents, (k, v) => (k === '' ? new Set(v) : v));
    const botnetMap: BotnetMap = new Map([...parsed]);

    return botnetMap;
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
