const nmapReplacer = (k: string, v: unknown) => (v instanceof Map ? [...v] : v);

export default nmapReplacer;
export {nmapReplacer};
