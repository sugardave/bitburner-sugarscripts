const botnetReviver = (k: string, v: unknown) =>
    k === '' ? new Map(v as [unknown, unknown][]) : v;

export default botnetReviver;
export {botnetReviver};
