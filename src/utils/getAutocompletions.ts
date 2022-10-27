import {Autocompleter} from 'global';

const getAutocompletions: Autocompleter = ({
    args,
    completionKeys = {},
    defaultReturn = []
}) => {
    const regex = /^--.*/;
    let completions = defaultReturn;

    for (const arg of args.slice(-2)) {
        const completionKey = arg as string;
        if (regex.test(completionKey)) {
            const flagMatch = completionKeys[completionKey.slice(2)];
            if (flagMatch) {
                completions = flagMatch;
            }
        }
    }
    return completions;
};

export default getAutocompletions;
export {getAutocompletions};
