import {AutocompleteData, NS, Player} from '@ns';
import {
    AutocompletionArgs,
    Autocompletions,
    CommandFlags,
    NetServer,
    NetServerDetails,
    Operators,
    NetServerMap,
    SortFields
} from 'global';
import {getAutocompletions} from 'utils/index';
import {hydrateServerMap} from 'utils/nmap/index';

const sortFields: SortFields = {
    cores: 'cpuCores',
    funds: 'moneyAvailable',
    // growTime: '',
    // hackChance: '',
    hackLevel: 'requiredHackingSkill',
    // hackTime: '',
    maxFunds: 'moneyMax',
    // maxSecLevel: '',
    minSecLevel: 'minDifficulty',
    minPortsToOpen: 'numOpenPortsRequired',
    ram: 'maxRam',
    secLevel: 'hackDifficulty',
    serverGrowth: 'serverGrowth'
    // weakenTime: ''
};

const operators: Operators = {
    '=': (a, b) => a === b,
    '==': (a, b) => a === b,
    '===': (a, b) => a === b,
    '<': (a, b) => a < b,
    '>': (a, b) => a > b,
    '<=': (a, b) => a <= b,
    '>=': (a, b) => a >= b
};

const customSchema: CommandFlags = [
    ['includeOwned', false],
    ['includeOverLevel', false],
    /**
     * A `limit` of 0 means no limit, otherwise, the final result will be limited to this value or fewer servers.
     */
    ['limit', 0],
    ['quiet', false],
    /**
     * `sortField` is an array of comma-delimited strings with the field to sort, the operator following it, and the comparator last.  For example:
     *
     * --sortField 'cores,>,1'
     *
     * Equality comparisons are the default and the operator can be omitted, so the following examples are equivalent:
     *
     * --sortField 'cores,1'
     * --sortField 'cores,=,1'
     */
    ['sortField', []],
    /**
     * ``sortOrder` will run for each `sortField`, meaning the last `sortField` specified will determine the map structure
     */
    ['sortOrder', 'descending']
];

const argsSchema: CommandFlags = [...customSchema];

const autocomplete = ({flags}: AutocompleteData, args: AutocompletionArgs) => {
    const completionKeys: Autocompletions = {
        sortField: Array.from(Object.keys(sortFields)),
        sortOrder: ['ascending', 'descending']
    };
    flags(argsSchema);
    return getAutocompletions({args, completionKeys});
};

const getSortFieldProperty = ({sortField}: SortFields) => sortFields[sortField];

const parseSortFieldOptions = ({sortField}: SortFields) => {
    const parts = sortField.split(',');
    const fieldFlag = parts[0];
    const field = getSortFieldProperty({sortField: fieldFlag});
    const operator = parts.length === 2 ? '===' : parts[1];
    const comparator = Number(parts.length === 2 ? parts[1] : parts[2]);

    return {comparator, field, fieldFlag, operator};
};

const compare =
    ({sortField}: SortFields) =>
    ([, {...serverInfo}]: [string, NetServerDetails]) => {
        const {comparator, field, operator} = parseSortFieldOptions({
            sortField
        });
        const prop = serverInfo[field] as number | string;
        const result = operators[operator](prop, comparator);

        return result;
    };

const sortServers = (
    ns: NS,
    {sortField}: SortFields,
    {
        includeOwned,
        includeOverLevel,
        serverMap,
        sortOrder
    }: {
        includeOwned: boolean;
        includeOverLevel: boolean;
        serverMap: Map<string, NetServerDetails>;
        sortOrder: string;
    }
) => {
    const {getPlayer} = ns;
    const {
        skills: {hacking}
    }: Player = getPlayer();
    const result = new Map();
    const clone = new Map(serverMap);

    // if no sort field, then run the final filtering on the map to remove or include owned servers and servers above the player's hacking skill
    if (!sortField) {
        clone.forEach((serverInfo, hostname) => {
            const {purchasedByPlayer, requiredHackingSkill} = serverInfo;
            if (
                (!purchasedByPlayer || includeOwned) &&
                ((requiredHackingSkill && requiredHackingSkill <= hacking) ||
                    includeOverLevel) &&
                !result.has(hostname)
            ) {
                result.set(hostname, serverInfo);
            }
        });
    } else {
        Array.from(serverMap)
            .filter(compare({sortField} as SortFields))
            .sort(
                (
                    [, {...a}]: [string, Record<string, unknown>],
                    [, {...b}]: [string, Record<string, unknown>]
                ) => {
                    const {field} = parseSortFieldOptions({
                        sortField
                    } as SortFields);
                    const multiplier = sortOrder === 'ascending' ? 1 : -1;

                    if (
                        (a[field] as number | string) <
                        (b[field] as number | string)
                    ) {
                        return -1 * multiplier;
                    }
                    if (
                        (b[field] as number | string) <
                        (a[field] as number | string)
                    ) {
                        return 1 * multiplier;
                    }
                    return 0;
                }
            )
            .map(([, {...serverInfo}]) => {
                const {hostname} = serverInfo as NetServer;
                if (!result.has(hostname)) {
                    result.set(hostname, serverInfo);
                }
            });
    }
    return result;
};

const outputList = (ns: NS, serverMap: NetServerMap) => {
    const {flags} = ns;
    const {sortField: sortFields} = flags(argsSchema);
    const fields = sortFields as string[];
    const terminalOut: string[] = [];
    const outputFieldString = ({hostname}: {hostname: string}) => {
        const fieldStrings: string[] = [];
        fields.map((sortField: string) => {
            const {field, fieldFlag} = parseSortFieldOptions({sortField});
            const server = serverMap.get(hostname) as Record<string, NetServer>;
            fieldStrings.push(
                `${fieldFlag}: ${server ? server[field] : 'error'}`
            );
        });
        return fieldStrings.join(', ');
    };

    serverMap.forEach(({hostname, ip}) =>
        terminalOut.push(
            `${hostname}/${ip}${
                (sortFields as string[]).length
                    ? `:\n\t\t${outputFieldString({hostname} as {
                          hostname: string;
                      })}`
                    : ''
            }`
        )
    );
    return `\n\n\t${terminalOut.join('\n\n\t')}`;
};

const listServers = (
    ns: NS,
    {
        includeOwned,
        includeOverLevel,
        limit,
        quiet,
        sortField: sortFields,
        sortOrder = 'descending'
    }: {
        includeOwned: boolean;
        includeOverLevel: boolean;
        limit: number;
        quiet: boolean;
        sortField: string[];
        sortOrder: string;
    },
    {
        skipStash = false,
        stashName = 'nmap'
    }: {filename: string; skipStash: boolean; stashName: string}
) => {
    const {tprint} = ns;
    // first, get all the servers
    let serverMap = hydrateServerMap(ns, {
        skipStash,
        stash: {id: stashName}
    }) as Map<string, NetServerDetails>;
    // then, iterate sortFields array and call the sort function for each one
    let i = 0;
    do {
        const sortField = sortFields[i];
        serverMap = new Map(
            Array.from(
                sortServers(
                    ns,
                    {sortField},
                    {includeOwned, includeOverLevel, serverMap, sortOrder}
                )
            )
        );
        i += 1;
    } while (i <= sortFields.length);

    // prepare results as an Array
    const result = Array.from(serverMap.values());
    // limit the final result if necessary
    result.splice(limit ? limit : result.length + 1);
    if (!quiet) {
        tprint(outputList(ns, new Map(serverMap)));
    }
    return result;
};

const main = async (ns: NS) => {
    const {flags} = ns;
    const {
        includeOwned,
        includeOverLevel,
        limit,
        quiet = false,
        sortField,
        sortOrder = 'descending'
    } = flags(argsSchema);
    return listServers(
        ns,
        {
            includeOwned,
            includeOverLevel,
            limit,
            quiet,
            sortField,
            sortOrder
        } as {
            includeOwned: boolean;
            includeOverLevel: boolean;
            limit: number;
            quiet: boolean;
            sortField: string[];
            sortOrder: string;
        },
        {filename: 'all-servers.txt', skipStash: false, stashName: 'nmap'}
    );
};

export default main;
export {autocomplete, listServers, main};
