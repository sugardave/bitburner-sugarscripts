const getDataStash = (
    doc = document,
    id = 'data-stash',
    tag = 'div'
): HTMLElement => {
    let el = doc.getElementById(id);
    if (!el?.parentNode) {
        el = doc.createElement(tag);
        el.id = id;
        el.hidden = true;

        doc.body.appendChild(el as Node);
    }
    return el as HTMLElement;
};

export default getDataStash;
export {getDataStash};
