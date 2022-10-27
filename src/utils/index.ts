import {NetServer} from 'global';
import {commonSchema} from 'utils/commonSchema';
import {getAutocompletions} from 'utils/getAutocompletions';

// Classes
class BaseServer implements NetServer {
    chain?: string[] | undefined;
    hostname;
    constructor({chain, hostname}: NetServer) {
        this.chain = chain;
        this.hostname = hostname;
    }
}

class Server extends BaseServer {
    constructor(hostname: string) {
        super({hostname});
    }
}

export {commonSchema, getAutocompletions, Server};
