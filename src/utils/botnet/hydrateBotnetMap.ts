import {NS} from '@ns';
import {fileLocations, MapFile} from 'utils/io/index';
import {botnetMap} from 'utils/botnet/botnetMap';
import {stashData} from 'utils/data/index';
import {BotnetMap} from 'global';

const hydrateBotnetMap = (ns: NS, mapType = 'all') => {
    const {location, suffix} = fileLocations.botnetMapCache;
    const mapFile = new MapFile(ns, `${mapType}${suffix}`, location);
    const contents = mapFile.read() || '[]';
    const parsed = JSON.parse(contents);
    const result: BotnetMap = new Map([
        ...(parsed.length ? parsed : botnetMap)
    ]);

    stashData({data: contents, stashName: 'botnetMap'});
    return result;
};

const main = async (ns: NS) => hydrateBotnetMap(ns);

export default main;
export {hydrateBotnetMap, main};
