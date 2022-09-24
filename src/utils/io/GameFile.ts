import {NS} from '@ns';

class GameFile {
    location;
    name;

    static ns: NS;

    constructor(name: string, location = '/') {
        this.location = location;
        this.name = name;
    }

    static exists(file: string) {
        const {fileExists} = GameFile.ns;

        return fileExists(file);
    }

    getFilePath() {
        return `${this.location}/${this.name}`;
    }

    read() {
        const {read} = GameFile.ns;
        const thisFile = this.getFilePath();

        if (GameFile.exists(thisFile)) {
            return read(thisFile);
        } else {
            return `${thisFile} does not exist!`;
        }
    }

    write(contents: string | number | string[], append = false) {
        const {write} = GameFile.ns;
        const thisFile = this.getFilePath();
        write(thisFile, contents, append ? 'a' : 'w');
    }
}

export default GameFile;
export {GameFile};
