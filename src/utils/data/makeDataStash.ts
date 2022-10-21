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

export default makeDataStash;
export {makeDataStash};
