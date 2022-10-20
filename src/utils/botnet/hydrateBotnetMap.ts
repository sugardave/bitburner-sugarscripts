import {NS} from '@ns';
import {fileLocations, MapFile} from 'utils/io/index';
import {botnetMap} from 'utils/botnet/botnetMap';

const hydrateBotnetMap = (ns: NS, mapType = 'all') => {
    const {location, suffix} = fileLocations.botnetMapCache;
    const mapFile = new MapFile(ns, `${mapType}${suffix}`, location);
    const contents = mapFile.read();
    const result = contents ? JSON.parse(contents) : botnetMap;

    return new Map(result);
};

export default hydrateBotnetMap;
export {hydrateBotnetMap};
