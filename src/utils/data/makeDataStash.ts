import {getDataStash} from 'utils/data/getDataStash';

const makeDataStash = (doc = document, id = 'data-stash'): HTMLElement => {
    const el = getDataStash(doc, id);
    const stash = {cache: {botnetMap: [], nmapCache: []}};
    if (!el.dataset.stash) {
        // tabula rasa
        el.setAttribute(id, JSON.stringify(stash));
    }

    return el;
};

const main = () => makeDataStash();

export default main;
export {makeDataStash, main};
