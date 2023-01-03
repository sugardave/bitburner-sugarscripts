import {AutocompleteData, NS, ScriptArg} from '@ns';

import {getAutocompletions} from 'utils/index';
import {CommandFlags} from '/global';

const customSchema: CommandFlags = [['once', false]];
const argsSchema: CommandFlags = [...customSchema];

const autocomplete = ({flags}: AutocompleteData, args: ScriptArg[]) => {
    flags(argsSchema);
    return getAutocompletions({args});
};

const shareComputer = async (ns: NS) => {
    const {once} = ns.flags(argsSchema);

    while (!once) {
        await ns.share();
    }
};

const main = async (ns: NS) => shareComputer(ns);

export default main;
export {autocomplete, main, shareComputer};
