import {BotnetMap} from 'global';
import {botnetReviver as reviver} from 'utils/botnet/botnetReviver';

const parseBotnetMap = (stringified: string): BotnetMap =>
    JSON.parse(stringified, reviver);

export default parseBotnetMap;
export {parseBotnetMap};
