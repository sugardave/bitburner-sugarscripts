//TODO: documentation.  make some.

import {NS, Server, ScriptArg} from '@ns';

type ServerChain = {
    chain: string[];
};

type ServerMapEntry = Map<NetServer['hostname'], Partial<Server>>;

type NetServer = Partial<Server> & Partial<ServerChain>;

type Executor = (ns: NS, server: NetServer) => NetServer | unknown | void;

interface CommandFlags {
    [flag: string]: CommandFlag;
}
type CommandFlag = [string, ScriptArg];

export {Executor, CommandFlags, NetServer, ServerMapEntry};
