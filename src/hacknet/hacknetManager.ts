import {AutocompleteData, NS} from '@ns';
import {
    AutocompletionArgs,
    CommandFlags,
    HacknetNodeManagerOptions
} from 'global';
import {
    argsSchema as nodeArgsSchema,
    completionKeys as nodeCompletionKeys,
    hacknetNodeManager
} from 'hacknet/node/hacknetNodeManager';
import {hacknetServerManager} from 'hacknet/server/hacknetServerManager';
import {getAutocompletions} from 'utils/index';

const customSchema: CommandFlags = [['context', '']];

const defaultSchema: CommandFlags = [...customSchema];
const nodeSchema: CommandFlags = [...nodeArgsSchema];
const argsSchema: CommandFlags = [...defaultSchema, ...nodeSchema];

const autocomplete = ({flags}: AutocompleteData, args: AutocompletionArgs) => {
    const {context} = flags(argsSchema);
    const defaultCompletionKeys = {
        context: ['node', 'server']
    };

    return getAutocompletions({
        args,
        completionKeys:
            context === 'node' ? nodeCompletionKeys : defaultCompletionKeys
    });
};

const hacknetManager = (
    ns: NS,
    {context, ...rest}: HacknetNodeManagerOptions
) => {
    if (context === 'node') {
        return hacknetNodeManager(ns, rest);
    } else {
        return hacknetServerManager(ns, rest);
    }
};

const main = async (ns: NS) =>
    hacknetManager(ns, ns.flags(argsSchema) as HacknetNodeManagerOptions);

export default main;
export {autocomplete, hacknetManager, main};
