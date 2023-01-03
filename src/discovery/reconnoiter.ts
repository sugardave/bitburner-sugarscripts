import {AutocompleteData, NS, ScriptArg} from '@ns';
import {CommandFlags, Executor, NetServer} from 'global';
import {commonSchema, getAutocompletions} from 'utils/index';
import {getServerInfo} from 'utils/discovery/index';

const customSchema: CommandFlags = [['quiet', false]];

const argsSchema: CommandFlags = [...commonSchema, ...customSchema];

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

const reconnoiter: Executor = (
    ns: NS,
    {hostname}: NetServer,
    {quiet, skipCache}
) => {
    const server = getServerInfo(ns, {hostname} as NetServer, {
        skipCache
    }) as NetServer;
    const {
        requiredHackingSkill: hackingLevel,
        maxRam: ram,
        minDifficulty: minSecLevel,
        moneyMax: maxLoot,
        serverGrowth: growthAmount
    } = server;
    const target = hostname as string;
    const hackChance = ns.nFormat(
        Math.round(ns.hackAnalyzeChance(target)),
        '(0.000%)'
    );
    const loot = ns.nFormat(ns.getServerMoneyAvailable(target), '($0.00 a)');
    const secLevel = ns.getServerSecurityLevel(target);
    const formatTime = (ms: number) =>
        ns.sprintf('%08s', ns.nFormat(ms / 1000, '00:00:00'));
    const growTime = formatTime(ns.getGrowTime(target));
    const hackTime = formatTime(ns.getHackTime(target));
    const weakenTime = formatTime(ns.getWeakenTime(target));

    if (!quiet) {
        ns.tprint(
            `\n\t\t\t\tavailable money: ${loot}\tmaximum funds: ${maxLoot}`
        );
        ns.tprint(
            `\n\t\t\t\tsecurity level: ${secLevel}\tminimum level: ${minSecLevel}`
        );
        ns.tprint(`\n\t\t\t\ttimings:\t\tweaken\t\t\tgrow\t\t\thack`);
        ns.tprint(`\t\t\t\t${weakenTime}\t\t${growTime}\t\t${hackTime}`);
        ns.tprint(`\n\t\t\t\tRAM: ${ram}`);
        ns.tprint(
            `\n\t\t\t\thacking level: ${hackingLevel}\thack chance: ${hackChance}`
        );
        ns.tprint(`\n\t\t\t\tserver growth parameter: ${growthAmount}`);
    }
    return server;
};

const main = async (ns: NS) => {
    const {quiet, target: hostname = ns.getHostname()} = ns.flags(argsSchema);
    return reconnoiter(ns, {hostname} as NetServer, {quiet, skipCache: true});
};

export default main;
export {autocomplete, main, reconnoiter};
