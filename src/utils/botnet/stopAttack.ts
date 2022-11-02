import {NS} from '@ns';
import {BotnetManagerOptions, CommandFlags} from 'global';
import {botnetFlagsSchemas} from 'utils/botnet/botnetFlagsSchemas';
import {hydrateBotnetMap} from 'utils/botnet/hydrateBotnetMap';

const argsSchema: CommandFlags = [...botnetFlagsSchemas.stopAttack];

const stopAttack = (ns: NS, {botnet: botnets}: BotnetManagerOptions) => {
    const {killall} = ns;
    const botnetMap = hydrateBotnetMap(ns, {
        mapType: 'all',
        skipStash: false,
        stashName: 'botnetMap'
    });

    for (const net of botnets as string[]) {
        const botnet = botnetMap.get(net);
        const members = botnet ? [...botnet.values()] : [];
        members.map((hostname) => {
            killall(hostname);
        });
    }
};

const main = async (ns: NS) => {
    const {flags} = ns;
    const {botnet} = flags(argsSchema);
    return stopAttack(ns, {botnet});
};

export default main;
export {main, stopAttack};
