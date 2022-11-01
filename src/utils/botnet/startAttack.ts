import {NS} from '@ns';
import {BotnetMap, CommandFlags, ExecutorOptions, NetServer} from 'global';
import {deployScripts} from 'utils/botnet/deployScripts';
import {botnetFlagsSchemas} from 'utils/botnet/botnetFlagsSchemas';
import {commonSchema} from 'utils/index';
import {hydrateBotnetMap} from 'utils/botnet/hydrateBotnetMap';

const customSchema = [...botnetFlagsSchemas.startAttack];
const argsSchema: CommandFlags = [...commonSchema, ...customSchema];

// TODO: investigate turning this into an Executor or changing to a different option type
const startAttack = (
    ns: NS,
    {botnet: botnets, target, threads = 1}: ExecutorOptions
) => {
    const {exec, tprint} = ns;
    const botnetMap = hydrateBotnetMap(ns, {
        mapType: 'all',
        skipStash: false,
        stashName: 'botnetMap'
    }) as BotnetMap;
    (botnets as string[]).map((net) => {
        const botnet = botnetMap.get(net);
        botnet &&
            [...botnet.values()].map((hostname) => {
                if (!deployScripts(ns, {hostname} as NetServer, {})) {
                    tprint(`failed to deploy attack scripts to ${hostname}`);
                } else {
                    // attack!
                    exec(
                        `hacking/wgh.js`,
                        hostname as string,
                        threads as number,
                        `--target`,
                        target as string
                    );
                }
            });
    });
};

const main = async (ns: NS) => {
    const {flags} = ns;

    const {botnet, target, threads = 1} = flags(argsSchema);
    return startAttack(ns, {botnet, target, threads});
};

export default main;
export {main, startAttack};
