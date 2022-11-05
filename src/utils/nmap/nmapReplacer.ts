const nmapReplacer = (k: string, v: unknown) =>
    v instanceof Map ? [...v.entries()] : v;

export default nmapReplacer;
export {nmapReplacer};
