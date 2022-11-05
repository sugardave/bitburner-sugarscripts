import {StashElement} from 'global';
import {getDataStash} from 'utils/data/getDataStash';

const deleteDataStash = ({
    doc = document,
    id = 'data-stash',
    tag = 'div'
}: StashElement = {}) => {
    const stash = getDataStash({doc, id, tag});
    doc.body.removeChild(stash);
};

const main = async () => deleteDataStash();

export default main;
export {deleteDataStash, main};
