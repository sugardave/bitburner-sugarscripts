import {StashElement} from 'global';

const getDataStash = ({
    doc = document,
    id = 'data-stash',
    tag = 'div'
}: StashElement = {}): HTMLElement => {
    let el = doc.getElementById(id);
    if (!el || !el.parentNode) {
        el = doc.createElement(tag);
        el.id = id;
        el.hidden = true;

        doc.body.appendChild(el);
    }
    return el;
};

export default getDataStash;
export {getDataStash};
