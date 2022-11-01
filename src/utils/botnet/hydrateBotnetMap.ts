import {NS} from '@ns';
import {fileLocations} from 'utils/io/index';
import {hydrateMap} from 'utils/hydrateMap';

const hydrateBotnetMap = (
    ns: NS,
    {mapType = 'all', skipStash = false, stashName = 'botnetMap'}
) => {
    const {location, suffix} = fileLocations.botnetMapCache;
    const contents = hydrateMap(
        ns,
        {filename: `${mapType}${suffix}`, location},
        {skipStash, stashName}
    );
    const botnetMap = JSON.parse(contents, (k, v) =>
        k === '' ? new Set(v) : v
    );

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
