import {NS} from '@ns';

const wipeout = (ns: NS) => {
    const {getScriptName, ls, rm} = ns;
    const jsFiles = ls('home', '.js');
    const txtFiles = ls('home', '.txt');
    const script = getScriptName();

    jsFiles.map((f: string) => {
        if (f !== script) {
            rm(f);
        }
    });
    txtFiles.map((f: string) => {
        rm(f);
    });
};

const main = async (ns: NS) => {
    return wipeout(ns);
};

export default main;
export {main, wipeout};
