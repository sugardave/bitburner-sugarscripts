import {getDataStash} from 'utils/data/getDataStash';

const deleteDataStash = ({
    doc = document
}: {
    doc?: Document;
} = {}) => {
    const stash = getDataStash() as HTMLElement;
    doc.body.removeChild(stash);
};

const main = async () => deleteDataStash({});

export default main;
export {deleteDataStash, main};
