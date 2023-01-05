import {AutocompleteData, NS, ScriptArg} from '@ns';
import {Autocompletions, CommandFlags, Executor, NetServer} from 'global';
import {commonSchema, getAutocompletions} from 'utils/index';
import {crackPorts} from 'utils/hacking/crackPorts';

const argsSchema: CommandFlags = [...commonSchema];

const autocomplete = (
    {flags, servers}: AutocompleteData,
    args: ScriptArg[]
) => {
    const completionKeys: Autocompletions = {
        target: [...servers]
    };
    flags(argsSchema);
    return getAutocompletions({args, completionKeys});
};

const prepForPwnage: Executor = (ns: NS, server: NetServer) => {
    if (!crackPorts(ns, server, {})) {
        return;
    }
    return server;
};

const pwnServer: Executor = (ns: NS, server: NetServer) => {
    const {getServer, nuke, tprint} = ns;
    const {hostname: target, numOpenPortsRequired} = getServer(
        server.hostname as string
    );
    tprint(
        `pwnServer ${server.hostname}; needs ${numOpenPortsRequired} ports open`
    );
    if ((numOpenPortsRequired as number) > 0) {
        if (!prepForPwnage(ns, server, {})) {
            return;
        }
    }
    nuke(target as string);
    tprint(`${target} PWNed!`);
};

const pwn = (ns: NS) => {
    const {flags, getHostname} = ns;
    const {target} = flags([...argsSchema, ['target', getHostname()]]);
    const hostname = target as string;

    return pwnServer(ns, {hostname}, {});
};

const main = async (ns: NS) => pwn(ns);

export default main;
export {autocomplete, main, pwn, pwnServer};
