//TODO: documentation.  make some.

import {NS, Server, ScriptArg} from '@ns';

type ServerChain = {
    chain: string[];
};

type ServerMapEntry = Map<NetServer['hostname'], Partial<Server>>;

type NetServer = Partial<Server> & Partial<ServerChain>;

type ExecutorOptions = Record<string, unknown>;

type Executor = (
    ns: NS,
    server: NetServer,
    options: ExecutorOptions
) => NetServer | ScriptArg | boolean | unknown | void;

// command flag handling for autocompletion and other scripts
type AutocompletionArgs = ScriptArg[];
type Autocompletions = {
    [key: string]: ScriptArg[] | string[];
};
type AutocompletionResult = unknown[] | [];

type AutocompleterArgs = {
    args: AutocompletionArgs;
    completionKeys?: Autocompletions;
    defaultReturn?: AutocompletionResult;
};
type Autocompleter = (completerArgs: AutocompleterArgs) => AutocompletionResult;

type CommandFlag = [string, ScriptArg | []];
type CommandFlags = CommandFlag[];

// botnet
type BotServer = {memberOf: string} & Partial<NetServer>;
type Botnet = {
    name: string;
    members?: BotServer[];
};
type BotnetMap = Map<Botnet['name'], Botnet>;

type BotnetManagerOptions = {
    [name: string]: ScriptArg | ScriptArg[];
};

export {
    Autocompleter,
    AutocompletionArgs,
    AutocompletionResult,
    Autocompletions,
    Botnet,
    BotnetManagerOptions,
    BotnetMap,
    BotServer,
    CommandFlag,
    CommandFlags,
    Executor,
    ExecutorOptions,
    NetServer,
    ServerMapEntry
};
