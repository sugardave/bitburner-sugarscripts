const generateBotnetName = (botName: string): string => {
    const regex = /(.*)-\d+$/;
    const botnetName = regex.exec(botName);

    return botnetName ? botnetName[1] : botName;
};

export default generateBotnetName;
export {generateBotnetName};
