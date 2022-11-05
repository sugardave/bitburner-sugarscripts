//TODO: documentation.  make some.
import {NS, Server, ScriptArg} from '@ns';

type ServerChain = {
    chain: string[];
};

type NetServer = Partial<Server> & Partial<ServerChain>;
type NetServerDetails = {
    [key: string]: ScriptArg;
};
type NetServerMap = Map<NetServer['hostname'], Partial<Server>>;

type NetServerStashElement = StashElement & {
    replacer?: (k: string, v: unknown) => unknown;
    reviver?: (k: string, v: string) => unknown;
};

type ExecutorOptions = Record<string, unknown>;

type Executor = (
    ns: NS,
    server: NetServer,
    options: ExecutorOptions
) => NetServer | ScriptArg | boolean | unknown | void;

// data in the DOM
type StashElementProperties = {
    doc: Document;
    id: string;
    tag: string;
    replacer: (k: string, v: unknown) => unknown;
    reviver: (k: string, v: string) => unknown;
};
type StashElement = Partial<HTMLElement> & Partial<StashElementProperties>;

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
type BotServer = {hostname: string};
type Botnet = Set<BotServer['hostname']>;
type BotnetMap = Map<string, Botnet>;
type BotnetStashElement = Partial<StashElement> & {
    replacer?: (k: string, v: unknown) => unknown;
    reviver?: (k: string, v: string) => unknown;
};

type BotnetManagerOptions = {
    [name: string]: ScriptArg | ScriptArg[];
};

// discovery
// listServers
type OperatorFunction = (a: number | string, b: number | string) => boolean;

type Operators = {
    [operator: string]: OperatorFunction;
};

type SortField = string;

type SortFields = {
    [sortField: SortField]: string;
};

type SortOption = {
    [sortOption: string]: string;
};

export {
    Autocompleter,
    AutocompletionArgs,
    AutocompletionResult,
    Autocompletions,
    Botnet,
    BotnetManagerOptions,
    BotnetMap,
    BotnetStashElement,
    BotServer,
    CommandFlag,
    CommandFlags,
    Executor,
    ExecutorOptions,
    NetServer,
    NetServerDetails,
    NetServerMap,
    NetServerStashElement,
    OperatorFunction,
    Operators,
    SortField,
    SortFields,
    SortOption,
    StashElement,
    StashElementProperties
};
