import {NS} from '@ns';

class GameFile {
    location;
    name;

    static ns: NS;

    constructor(name: string, location = '/') {
        this.location = location;
        this.name = name;
    }

    exists(file: string) {
        return GameFile.ns.fileExists(file);
    }

    getFilePath() {
        return `${this.location}/${this.name}`;
    }

    read() {
        return GameFile.ns.read(this.getFilePath());
    }

    write(contents: string, append = false) {
        return GameFile.ns.write(
            this.getFilePath(),
            contents,
            append ? 'a' : 'w'
        );
    }
}

export default GameFile;
export {GameFile};
