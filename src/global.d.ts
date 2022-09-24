//TODO: documentation.  make some.

import {NS, Server, ScriptArg} from '@ns';

type ServerChain = {
    chain: string[];
};

type ServerMapEntry = Map<NetServer['hostname'], Partial<Server>>;

type NetServer = Partial<Server> & Partial<ServerChain>;

type Executor = (ns: NS, server: NetServer) => NetServer | unknown | void;

type CommandFlag = string[] | ScriptArg;
interface CommandFlags {
    [flag: string]: CommandFlag;
}

export {Executor, CommandFlags, NetServer, ServerMapEntry};
