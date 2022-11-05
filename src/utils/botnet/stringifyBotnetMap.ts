import {BotnetMap} from 'global';
import {botnetReplacer as replacer} from 'utils/botnet/botnetReplacer';

const stringifyBotnetMap = (botnetMap: BotnetMap): string =>
    JSON.stringify(Array.from(botnetMap), replacer);

export default stringifyBotnetMap;
export {stringifyBotnetMap};
