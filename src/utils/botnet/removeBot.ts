import {NS} from '@ns';
import {Botnet, BotnetManagerOptions, BotnetMap, CommandFlags} from 'global';
import {botnetFlagsSchema} from 'utils/botnet/botnetFlagsSchema';
import {cacheBotnetMap} from 'utils/botnet/cacheBotnetMap';
import {generateBotnetName} from 'utils/botnet/generateBotnetName';
import {hydrateBotnetMap} from 'utils/botnet/hydrateBotnetMap';

const argsSchema: CommandFlags = [...botnetFlagsSchema];

// TODO: add autocomplete
// TODO: refine/simplify `addBot` to something closer to `removeBot`

const removeBot = (ns: NS, {bot}: BotnetManagerOptions) => {
    const {deleteServer} = ns;
    const botnets = hydrateBotnetMap(ns);
    const botnetName = generateBotnetName(bot as string);
    const deleted: boolean = deleteServer(bot as string);
    if (deleted) {
        const {members = []} = botnets.get(botnetName) as Botnet;
        botnets.set(botnetName, {
            name: botnetName,
            members: [...members].filter(({hostname}) => {
                return hostname !== bot;
            })
        });
        cacheBotnetMap(ns, botnets as BotnetMap);
    }

    return deleted;
};

const main = async (ns: NS) => {
    const {flags} = ns;
    const {bot} = flags(argsSchema);
    return removeBot(ns, {bot});
};

export default main;
export {main, removeBot};
