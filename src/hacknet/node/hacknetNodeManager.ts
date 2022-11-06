import {AutocompleteData, NS} from '@ns';
import {
    AutocompletionArgs,
    CommandFlags,
    HacknetNodeManagerOptions
} from 'global';
import {getAutocompletions} from 'utils/index';

const customSchema: CommandFlags = [
    ['action', ''],
    ['component', ''],
    ['node', 0],
    ['quantity', 1]
];

const argsSchema: CommandFlags = [...customSchema];

const actions = ['checkPricing', 'purchaseNode', 'upgrade'];
const flagOptions = {
    component: ['core', 'level', 'ram']
};
const completionKeys = {
    action: [...actions],
    component: [...flagOptions.component]
};

const autocomplete = ({flags}: AutocompleteData, args: AutocompletionArgs) => {
    flags(argsSchema);
    return getAutocompletions({args, completionKeys});
};

const hacknetNodeManager = (
    ns: NS,
    {action, component, node, quantity}: HacknetNodeManagerOptions
) => {
    const {hacknet, tprint} = ns;
    const {
        getCoreUpgradeCost,
        getLevelUpgradeCost,
        getRamUpgradeCost,
        purchaseNode,
        upgradeCore,
        upgradeLevel,
        upgradeRam
    } = hacknet;

    switch (action) {
        case 'checkPricing':
            switch (component) {
                case 'core':
                    getCoreUpgradeCost(node, quantity);
                    break;
                case 'level':
                    getLevelUpgradeCost(node, quantity);
                    break;
                case 'ram':
                    getRamUpgradeCost(node, quantity);
                    break;
                default:
                    tprint(
                        `\nno component ('core', 'level', or 'ram') specified for price check`
                    );
                    break;
            }
            break;
        case 'purchaseNode':
            purchaseNode();
            break;
        case 'upgrade':
            switch (component) {
                case 'core':
                    upgradeCore(node, quantity);
                    break;
                case 'level':
                    upgradeLevel(node, quantity);
                    break;
                case 'ram':
                    upgradeRam(node, quantity);
                    break;

                default:
                    break;
            }
            break;

        default:
            break;
    }
};

const main = async (ns: NS) =>
    hacknetNodeManager(ns, ns.flags(argsSchema) as HacknetNodeManagerOptions);

export default main;
export {argsSchema, autocomplete, completionKeys, hacknetNodeManager, main};
