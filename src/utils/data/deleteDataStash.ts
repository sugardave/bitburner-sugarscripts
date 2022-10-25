import {getDataStash} from 'utils/data/getDataStash';

const deleteDataStash = ({
    doc = document,
    stashName,
    stashType = 'cache'
}: {
    doc: Document;
    stashName: string;
    stashType: string;
}) => {
    const stash = getDataStash();
    doc.removeChild(stash);
};

export default deleteDataStash;
export {deleteDataStash};
