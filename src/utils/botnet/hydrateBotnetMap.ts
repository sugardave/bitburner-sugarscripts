import {NS} from '@ns';
import {fileLocations, MapFile} from 'utils/io/index';
import {botnetMap} from 'utils/botnet/botnetMap';
import {stashData} from 'utils/data/index';

const hydrateBotnetMap = (ns: NS, mapType = 'all') => {
    const {location, suffix} = fileLocations.botnetMapCache;
    const mapFile = new MapFile(ns, `${mapType}${suffix}`, location);
    const contents = mapFile.read() || '[]';
    const parsed = JSON.parse(contents);
    const result = new Map([...(parsed.length ? parsed : botnetMap)]);

    stashData({data: contents, stashName: 'botnetMap'});

    return result;
};

export default hydrateBotnetMap;
export {hydrateBotnetMap};
