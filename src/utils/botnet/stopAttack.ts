import {NS} from '@ns';
import {BotnetMap, CommandFlags} from 'global';
import {botnetFlagsSchemas} from 'utils/botnet/botnetFlagsSchemas';
import {hydrateBotnetMap} from 'utils/botnet/hydrateBotnetMap';

const argsSchema: CommandFlags = [...botnetFlagsSchemas.stopAttack];

const stopAttack = (ns: NS, botnets: string[]) => {
    const {killall} = ns;
    const botnetMap = hydrateBotnetMap(ns) as BotnetMap;
    for (const botnet of botnets) {
        if (botnetMap.size && botnetMap.has(botnet)) {
            botnetMap.get(botnet)?.members?.map(({hostname}) => {
                killall(hostname);
            });
        }
    }
};

const main = async (ns: NS) => {
    const {flags} = ns;
    const {botnet: botnets} = flags(argsSchema);
    return stopAttack(ns, botnets as string[]);
};

export default main;
export {main, stopAttack};
