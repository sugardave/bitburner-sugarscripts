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
    const {
        getGrowTime,
        getHackTime,
        getServerMoneyAvailable,
        getServerSecurityLevel,
        getWeakenTime,
        hackAnalyzeChance,
        nFormat,
        sprintf,
        tprint
    } = ns;
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
    const hackChance = nFormat(
        Math.round(hackAnalyzeChance(target)),
        '(0.000%)'
    );
    const loot = nFormat(getServerMoneyAvailable(target), '($0.00 a)');
    const secLevel = getServerSecurityLevel(target);
    const formatTime = (ms: number) =>
        sprintf('%08s', nFormat(ms / 1000, '00:00:00'));
    const growTime = formatTime(getGrowTime(target));
    const hackTime = formatTime(getHackTime(target));
    const weakenTime = formatTime(getWeakenTime(target));

    if (!quiet) {
        tprint(`\n\t\t\t\tavailable money: ${loot}\tmaximum funds: ${maxLoot}`);
        tprint(
            `\n\t\t\t\tsecurity level: ${secLevel}\tminimum level: ${minSecLevel}`
        );
        tprint(`\n\t\t\t\ttimings:\t\tweaken\t\t\tgrow\t\t\thack`);
        tprint(`\t\t\t\t${weakenTime}\t\t${growTime}\t\t${hackTime}`);
        tprint(`\n\t\t\t\tRAM: ${ram}`);
        tprint(
            `\n\t\t\t\thacking level: ${hackingLevel}\thack chance: ${hackChance}`
        );
        tprint(`\n\t\t\t\tserver growth parameter: ${growthAmount}`);
    }
    return server;
};

const main = async (ns: NS) => {
    const {flags, getHostname} = ns;
    const {quiet, target: hostname = getHostname()} = flags(argsSchema);
    return reconnoiter(ns, {hostname} as NetServer, {quiet, skipCache: true});
};

export default main;
export {autocomplete, main, reconnoiter};
