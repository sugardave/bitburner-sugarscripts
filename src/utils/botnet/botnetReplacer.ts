const botnetReplacer = (k: string, v: unknown) =>
    v instanceof Map ? [...v.entries()] : v instanceof Set ? [...v] : v;

export default botnetReplacer;
export {botnetReplacer};
