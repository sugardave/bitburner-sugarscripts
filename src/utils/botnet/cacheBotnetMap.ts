import {NS} from '@ns';
import {Botnet, BotnetMap, BotnetStashElement} from 'global';
import {fileLocations} from 'utils/io/index';
import {hydrateBotnetMap} from 'utils/botnet/hydrateBotnetMap';
import {botnetReplacer as replacer} from 'utils/botnet/botnetReplacer';
import {cacheMap} from 'utils/cacheMap';

const cacheBotnetMap = (
    ns: NS,
    {
        botnetMap,
        mapType = 'all',
        skipStash = false,
        stash = {id: 'botnetMap', replacer}
    }: {
        botnetMap: Map<string, Botnet>;
        mapType?: string;
        skipStash?: boolean;
        stash?: BotnetStashElement;
    }
) => {
    const {location, suffix} = fileLocations.botnetMap;

    return cacheMap(
        ns,
        {data: Array.from(botnetMap), name: `${mapType}${suffix}`, location},
        {skipStash, stash}
    );
};

const main = async (ns: NS) => {
    const stash: BotnetStashElement = {
        id: 'botnetMap',
        replacer
    };
    const botnetMap = hydrateBotnetMap(ns, {
        mapType: 'all',
        stash
    });

    return cacheBotnetMap(ns, {botnetMap, mapType: 'all', stash} as {
        botnetMap: BotnetMap;
        mapType: string;
        stash: BotnetStashElement;
    });
};

export default main;
export {cacheBotnetMap, main};
