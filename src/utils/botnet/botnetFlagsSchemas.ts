import {CommandFlags} from 'global';

type BotnetCommandFlags = {
    addBot: CommandFlags;
    addBotnet: CommandFlags;
    checkPricing: CommandFlags;
    getBotnetStatus: CommandFlags;
    removeBot: CommandFlags;
    removeBotnet: CommandFlags;
    startAttack: CommandFlags;
    stopAttack: CommandFlags;
};

const botnetFlagsSchemas: BotnetCommandFlags = {
    addBot: [
        ['bot', ''],
        ['quantity', 1],
        ['ram', 0]
    ],
    addBotnet: [
        ['botnet', ''],
        ['quantity', 1],
        ['ram', 0]
    ],
    checkPricing: [['ram', []]],
    getBotnetStatus: [['botnet', []]],
    removeBot: [['bot', '']],
    removeBotnet: [['botnet', []]],
    startAttack: [
        ['bot', []],
        ['botnet', []],
        ['threads', 1]
    ],
    stopAttack: [
        ['bot', []],
        ['botnet', []]
    ]
};

export default botnetFlagsSchemas;
export {botnetFlagsSchemas};
