import {AutocompleteData, NS, ScriptArg} from '@ns';
import {CommandFlags, Executor, NetServer} from 'global';
import {commonSchema, getAutocompletions} from 'utils/index';
import {getServerInfo} from 'utils/discovery/getServerInfo';

const argsSchema: CommandFlags = [...commonSchema];

const autocomplete = (
    {flags, servers}: AutocompleteData,
    args: ScriptArg[]
) => {
    const completionKeys = {
        target: [...servers]
    };
    flags(argsSchema);
    return getAutocompletions({args, completionKeys});
};
const isPlayerOwned: Executor = (ns: NS, server: NetServer) => {
    const {flags, getHostname} = ns;
    const {target} = flags([...argsSchema, ['target', getHostname()]]);
    const hostname = server.hostname ? server.hostname : (target as string);
    const {purchasedByPlayer} = getServerInfo(ns) as NetServer;

    ns.tprint(
        `${hostname} is${!purchasedByPlayer ? ' not' : ''} owned by player`
    );
    return purchasedByPlayer;
};

const main = async (ns: NS) => isPlayerOwned(ns, {});

export default main;
export {autocomplete, main};
