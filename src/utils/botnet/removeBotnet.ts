import {NS} from '@ns';
import {Botnet, BotnetManagerOptions, BotnetMap, CommandFlags} from 'global';
import {botnetFlagsSchema} from 'utils/botnet/botnetFlagsSchema';
import {cacheBotnetMap} from 'utils/botnet/cacheBotnetMap';
import {hydrateBotnetMap} from 'utils/botnet/hydrateBotnetMap';
import {removeBot} from 'utils/botnet/removeBot';

const argsSchema: CommandFlags = [...botnetFlagsSchema];
// TODO: add autocomplete

const removeBotnet = (ns: NS, botnets: string[]) => {
    const botnetMap = hydrateBotnetMap(ns);
    for (const botnet of botnets) {
        const {members = []} = botnetMap.get(botnet) as Botnet;
        [...members].map(({hostname}) => {
            removeBot(ns, {bot: hostname} as BotnetManagerOptions);
        });
        if (!(botnetMap.get(botnet) as Botnet).members?.length) {
            botnetMap.delete(botnet);
        }
    }
    cacheBotnetMap(ns, botnetMap as BotnetMap);
};

const main = async (ns: NS) => {
    const {flags} = ns;
    const {botnet: botnets} = flags(argsSchema);
    return removeBotnet(ns, botnets as string[]);
};

export default main;
export {main};
