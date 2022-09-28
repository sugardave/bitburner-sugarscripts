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
const isServerRooted: Executor = async (ns: NS) => {
    const server = await getServerInfo(ns);
    return server.hasAdminRights;
};

const main = async (ns: NS) => await isServerRooted(ns, {});

export default main;
export {autocomplete, main};
