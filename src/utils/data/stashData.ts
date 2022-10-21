import {makeDataStash} from 'utils/data/makeDataStash';

const stashData = ({
    data,
    doc = document,
    stashName,
    stashType = 'cache'
}: {
    data: string | Map<string, unknown>;
    doc?: Document;
    stashName: string;
    stashType?: string;
}) => {
    const stash = {
        [stashType]: {
            [stashName]:
                data instanceof String ? JSON.parse(data as string) : data
        }
    };
    const el = makeDataStash(doc);
    const attr = doc.createAttribute(el.id);
    attr.value = JSON.stringify(stash);
    el.setAttributeNode(attr);
};

export default stashData;
export {stashData};
