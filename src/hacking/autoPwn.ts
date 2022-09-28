import {NS} from '@ns';
import {omniscan} from 'discovery/omniscan';
import {pwnServer} from 'hacking/pwn';

const autoPwn = async (ns: NS) => {
    omniscan(ns, {executor: pwnServer});
};

const main = async (ns: NS) => await autoPwn(ns);

export default main;
export {autoPwn, main};
