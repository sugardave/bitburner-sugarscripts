import {NS} from '@ns';

const wipeout = (ns: NS) => {
    const jsFiles = ns.ls('home', '.js');
    const txtFiles = ns.ls('home', '.txt');
    const script = ns.getScriptName();

    jsFiles.map((f: string) => {
        if (f !== script) {
            ns.rm(f);
        }
    });
    txtFiles.map((f: string) => {
        ns.rm(f);
    });
};

const main = async (ns: NS) => {
    return wipeout(ns);
};

export default main;
export {main, wipeout};
