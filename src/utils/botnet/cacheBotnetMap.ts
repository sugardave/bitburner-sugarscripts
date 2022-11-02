import {NS} from '@ns';
import {Botnet, BotnetMap} from 'global';
import {fileLocations} from 'utils/io/index';
import {hydrateBotnetMap} from 'utils/botnet/hydrateBotnetMap';
import {cacheMap} from 'utils/cacheMap';

const cacheBotnetMap = (
    ns: NS,
    {
        botnetMap,
        mapType = 'all',
        skipStash = false,
        stashName = 'botnetMap'
    }: {
        botnetMap: Map<string, Botnet>;
        mapType?: string;
        skipStash?: boolean;
        stashName?: string;
    }
) => {
    const {location, suffix} = fileLocations.botnetMapCache;
    const contents = JSON.stringify(Array.from(botnetMap), (k, v) => {
        if (v instanceof Set) {
            return [...v];
        }
        return v;
    });

    return cacheMap(
        ns,
        {contents, name: `${mapType}${suffix}`, location},
        {skipStash, stashName}
    );
};

const main = async (ns: NS) => {
    const {flags} = ns;
    const {mapType, skipStash, stashName} = flags([
        ['mapType', 'all'],
        ['skipStash', false],
        ['stashName', 'botnetMap']
    ]);
    const botnetMap = hydrateBotnetMap(ns, {
        mapType,
        skipStash: true, // skip stash for this hydration
        stashName
    } as {
        mapType: string;
        skipStash: boolean;
        stashName: string;
    });

    return cacheBotnetMap(ns, {botnetMap, mapType, skipStash, stashName} as {
        botnetMap: BotnetMap;
        mapType: string;
        skipStash: boolean;
        stashName: string;
    });
};

export default main;
export {cacheBotnetMap, main};
