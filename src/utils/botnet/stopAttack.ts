import {NS} from '@ns';
import {BotnetManagerOptions, BotnetMap, CommandFlags} from 'global';
import {botnetFlagsSchemas} from 'utils/botnet/botnetFlagsSchemas';
import {hydrateBotnetMap} from 'utils/botnet/hydrateBotnetMap';

const argsSchema: CommandFlags = [...botnetFlagsSchemas.stopAttack];

const stopAttack = (ns: NS, {botnet: botnets}: BotnetManagerOptions) => {
    const {killall} = ns;
    const botnetMap = hydrateBotnetMap(ns) as BotnetMap;
    for (const botnet of botnets as string[]) {
        if (botnetMap.size && botnetMap.has(botnet)) {
            botnetMap.get(botnet)?.members?.map(({hostname}) => {
                killall(hostname);
            });
        }
    }
};

const main = async (ns: NS) => {
    const {flags} = ns;
    const {botnet} = flags(argsSchema);
    return stopAttack(ns, {botnet});
};

export default main;
export {main, stopAttack};
