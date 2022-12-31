import {NS} from '@ns';

// @ts-expect-error `heart` is hidden from the NS type
const getKarma = (ns: NS) => ns.heart.break();

const main = async (ns: NS) => ns.tprint(getKarma(ns));

export default main;
export {getKarma, main};
