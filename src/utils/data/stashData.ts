import {StashElement} from 'global';
import {deleteDataStash} from 'utils/data/deleteDataStash';
import {makeDataStash} from 'utils/data/makeDataStash';

const stashData = ({data, stash}: {data: unknown; stash: StashElement}) => {
    const {doc = document, replacer} = stash;
    deleteDataStash(stash);
    const el = makeDataStash(stash);
    const attr = doc.createAttribute('data-stash');
    attr.value = JSON.stringify(data, replacer);
    el.setAttributeNode(attr);
};

export default stashData;
export {stashData};
