import {AutocompleteData, NS, ScriptArg} from '@ns';
import {CommandFlags} from 'global';
import {getAutocompletions} from 'utils/index';
import {botnetFlagsSchemas} from 'utils/botnet/botnetFlagsSchemas';
import {ramOptions} from 'utils/botnet/ramOptions';

const argsSchema: CommandFlags = [...botnetFlagsSchemas.checkPricing];

const autocomplete = ({flags}: AutocompleteData, args: ScriptArg[]) => {
    const completionKeys = {
        ram: [...ramOptions]
    };
    flags(argsSchema);
    return getAutocompletions({args, completionKeys});
};

const formatter = (ns: NS, value: number): string =>
    ns.nFormat(value, '$0.00a');

const getServerPriceList = (ns: NS, ram: ScriptArg[]) => {
    const prices = [];
    const result: {formatted: string; prices: ScriptArg[][]} = {
        formatted: ``,
        prices: []
    };
    if (!Array.isArray(ram)) {
        prices.push([ram, ns.getPurchasedServerCost(ram)]);
    } else {
        for (const option of ram && ram.length ? ram : ramOptions) {
            prices.push([
                option as number,
                ns.getPurchasedServerCost(option as number)
            ]);
        }
    }

    prices.map(([size, price]) => {
        result.prices.push([size, price]);
        result.formatted += `\n\t\t${size} GB: \t${
            size >= 128 ? `` : `\t`
        }${formatter(ns, price as number)}`;
    });

    return result;
};

const main = async (ns: NS) => {
    const {ram} = ns.flags(argsSchema);
    const output = getServerPriceList(ns, ram as ScriptArg[]);

    ns.tprint(output.formatted);
    return output;
};

export default main;
export {autocomplete, getServerPriceList, main};
