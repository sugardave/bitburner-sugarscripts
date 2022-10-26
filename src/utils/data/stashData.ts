import {makeDataStash} from 'utils/data/makeDataStash';
import {BotnetMap} from 'global';

const stashData = ({
    data = new Map(),
    doc = document,
    stashName,
    stashType = 'cache'
}: {
    data: string | Map<string, unknown>;
    stashName: string;
    doc?: Document;
    stashType?: string;
}) => {
    const stash = {
        [stashType]: {
            [stashName]:
                typeof data === 'string'
                    ? JSON.parse(data as string)
                    : Array.from((data as BotnetMap).entries())
        }
    };
    const el = makeDataStash(doc);
    const attr = doc.createAttribute(el.id);
    attr.value = JSON.stringify(stash);
    el.setAttributeNode(attr);
};

export default stashData;
export {stashData};
