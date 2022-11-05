import {NS} from '@ns';
import {omniscan} from 'discovery/omniscan';
import {pwnServer} from 'hacking/pwn';

const autoPwn = (ns: NS) => {
    omniscan(ns, {executor: pwnServer});
};

const main = async (ns: NS) => autoPwn(ns);

export default main;
export {autoPwn, main};
