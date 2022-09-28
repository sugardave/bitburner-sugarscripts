import {AutocompleteData, NS, ScriptArg} from '@ns';
import {Executor} from 'global';
import {commonSchema, getAutocompletions} from 'utils/index';
import {getServerInfo} from 'utils/discovery/index';

const argsSchema = [...commonSchema];

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
const isPlayerOwned: Executor = async (ns: NS) => {
    const server = await getServerInfo(ns);
    return server.purchasedByPlayer;
};

const main = async (ns: NS) => await isPlayerOwned(ns, {});

export default main;
export {autocomplete, main};
