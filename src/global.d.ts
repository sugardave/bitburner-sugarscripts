//TODO: documentation.  make some.

import {NS, Server, ScriptArg} from '@ns';

type ServerChain = {
    chain: string[];
};

type ServerMapEntry = Map<NetServer['hostname'], Partial<Server>>;

type NetServer = Partial<Server> & Partial<ServerChain>;

type Executor = (ns: NS, server: NetServer) => NetServer | unknown | void;

// command flag handling for autocompletion and other scripts
type AutoCompletionArgs = ScriptArg[];
type AutoCompletions = {
    [key: string]: [unknown[]];
};
type AutoCompletionResult = [unknown[]] | [];

type AutoCompleterArgs = {
    args: AutoCompletionArgs;
    completionKeys?: AutoCompletions;
    defaultReturn?: [unknown[]];
};
type AutoCompleter = (completerArgs: AutoCompleterArgs) => AutoCompletionResult;

type CommandFlag = [string, ScriptArg];
type CommandFlags = CommandFlag[];

export {
    AutoCompleter,
    AutoCompletionResult,
    CommandFlag,
    CommandFlags,
    Executor,
    NetServer,
    ServerMapEntry
};
