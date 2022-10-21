import {NS} from '@ns';
import {BotnetMap} from 'global';
import {fileLocations, MapFile} from 'utils/io/index';
import {stashData} from 'utils/data/index';

const cacheBotnetMap = (ns: NS, botnetMap: BotnetMap, mapType = 'all') => {
    const {location, suffix} = fileLocations.botnetMapCache;
    const mapFile = new MapFile(ns, `${mapType}${suffix}`, location);
    const stringified = JSON.stringify(Array.from(botnetMap.entries()));
    stashData({data: stringified, stashName: 'botnetMap'});
    mapFile.write(stringified);
};

export default cacheBotnetMap;
export {cacheBotnetMap};
