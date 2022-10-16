import {NS} from '@ns';
import {GameFile} from 'utils/io/GameFile';

class MapFile extends GameFile {
    constructor(ns: NS, name: string, location = '/trove/maps') {
        // set static member for class GameFile to this ns instance
        GameFile.ns = ns;
        super(name, location);
    }
}

export default MapFile;
export {MapFile};
