import {NS} from '@ns';
import {GameFile} from 'utils/io/GameFile';
import {fileLocations} from 'utils/io/fileLocations';

class MapFile extends GameFile {
    constructor(
        ns: NS,
        name: string,
        location = fileLocations.nmapCache.location
    ) {
        // set static member for class GameFile to this ns instance
        GameFile.ns = ns;
        super(ns, name, location);
    }
}

export default MapFile;
export {MapFile};
