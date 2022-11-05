import {NS} from '@ns';
import {getPortCrackers} from 'utils/hacking/getPortCrackers';

const getNumPortCrackers = (ns: NS) => getPortCrackers(ns).size;

const main = async (ns: NS) => getNumPortCrackers(ns);

export default main;
export {getNumPortCrackers, main};
