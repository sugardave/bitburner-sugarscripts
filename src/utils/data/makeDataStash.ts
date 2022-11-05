import {getDataStash} from 'utils/data/getDataStash';
import {StashElement} from 'global';

const makeDataStash = ({
    doc = document,
    id = 'data-stash',
    tag = 'div'
}: StashElement = {}): HTMLElement => {
    const el = getDataStash({doc, id, tag});
    if (!el.dataset.stash) {
        // tabula rasa
        el.setAttribute('data-stash', JSON.stringify([]));
    }

    return el;
};

const main = () => makeDataStash();

export default main;
export {makeDataStash, main};
