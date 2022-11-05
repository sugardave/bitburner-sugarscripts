const nmapReviver = (k: string, v: unknown) =>
    k === '' ? new Map(v as [unknown, unknown][]) : v;

export default nmapReviver;
export {nmapReviver};
