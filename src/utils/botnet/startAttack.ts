import {NS} from '@ns';
import {
    BotnetMap,
    BotServer,
    CommandFlags,
    ExecutorOptions,
    NetServer
} from 'global';
import {deployScripts} from 'utils/botnet/deployScripts';
import {botnetFlagsSchemas} from 'utils/botnet/botnetFlagsSchemas';
import {commonSchema} from 'utils/index';
import {hydrateBotnetMap} from 'utils/botnet/hydrateBotnetMap';

const customSchema = [...botnetFlagsSchemas.startAttack];
const argsSchema: CommandFlags = [...commonSchema, ...customSchema];

// TODO: investigate turning this into an Executor or changing to a different option type
const startAttack = (ns: NS, {botnet: botnets, target}: ExecutorOptions) => {
    const {exec, tprint} = ns;
    const botnetMap = hydrateBotnetMap(ns) as BotnetMap;
    (botnets as string[]).map((botnet) => {
        botnetMap.get(botnet)?.members?.map(({hostname}: BotServer) => {
            if (!deployScripts(ns, {hostname} as NetServer, {})) {
                tprint(`failed to deploy attack scripts to ${hostname}`);
            } else {
                // attack!
                exec(
                    `/hacking/wgh.js`,
                    hostname as string,
                    1,
                    `--target`,
                    target as string
                );
            }
        });
    });
};

const main = async (ns: NS) => {
    const {flags} = ns;

    const {botnet, target} = flags(argsSchema);
    return startAttack(ns, {botnet, target});
};

export default main;
export {main, startAttack};
