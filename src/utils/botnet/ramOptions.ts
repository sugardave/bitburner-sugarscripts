import {ScriptArg} from '@ns';

const getRamOptions = (): ScriptArg[] => {
    const range = [];
    for (let i = 1; i <= 20; i += 1) {
        const pow = Math.pow(2, i);
        range.push(pow.toString());
    }
    return range;
};

const ramOptions: ScriptArg[] = getRamOptions();

export {ramOptions};
