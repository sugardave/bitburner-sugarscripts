//TODO: documentation.  make some.

import {NS, Server, ScriptArg} from '@ns';

type ServerChain = {
    chain: string[];
};

type ServerMapEntry = Map<NetServer['hostname'], Partial<Server>>;

type NetServer = Partial<Server> & Partial<ServerChain>;

type Executor = (ns: NS, server: NetServer) => NetServer | unknown | void;

// command flag handling for autocompletion and other scripts
type AutocompletionArgs = ScriptArg[];
type Autocompletions = {
    [key: string]: ScriptArg[];
};
type AutocompletionResult = unknown[] | [];

type AutocompleterArgs = {
    args: AutocompletionArgs;
    completionKeys?: Autocompletions;
    defaultReturn?: AutocompletionResult;
};
type Autocompleter = (completerArgs: AutocompleterArgs) => AutocompletionResult;

type CommandFlag = [string, ScriptArg];
type CommandFlags = CommandFlag[];

export {
    Autocompleter,
    AutocompletionResult,
    CommandFlag,
    CommandFlags,
    Executor,
    NetServer,
    ServerMapEntry
};
