import { ColorFormat } from './module.color';

export class Match {

    // ---
    // variables and const
    // ---

    // INDEX 1: FULL HEX
    // INDEX 2: HEX INSIDE
    // INDEX 3: FULL HSL & RGB & HEX
    // INDEX 4: TYPE
    // INDEX 5: BRACKETS
    // INDEX 6: HSL & RGB & HEX INSIDE
    // INDEX 7: BRACKETS
    private static readonly regexMainFormat: RegExp = /^\s*(#?\s*(([a-zA-Z0-9]{3}){1,2})|([R|r][G|g][B|b]|[H|h][S|s][L|l]|[H|h][E|e][X|x])?\s*([\s]+|[\[]|[\(]|[\{])([a-zA-Z0-9\s,;°%]*)([\s]*|[\]]|[\)]|[\}]))\s*$/g;
    // INDEX 2: s...s
    // INDEX 3: [...]
    // INDEX 4: (...)
    // INDEX 5: {...}
    private static readonly regexBrackets: RegExp = /^\s*(\s{1}([a-zA-Z0-9\s,;°%]*)\s{1}|\[{1}([a-zA-Z0-9\s,;°%]*)\]{1}|\({1}([a-zA-Z0-9\s,;°%]*)\){1}|\{{1}([a-zA-Z0-9\s,;°%]*)\}{1})\s*$/g;
    // INDEX 2: HEX
    // INDEX 4: RGB
    // INDEX 5: HSL
    private static readonly regexValueFormat: RegExp = /^\s*((([a-zA-Z0-9]{3}){1,2})|([0-9\s,;]*[^°%a-zA-Z]*)|([0-9\s,;°%]*[^a-zA-Z]*))\s*$/g;

    // ---
    // public functions
    // ---

    public static regexCheckFormat(value: string): [ColorFormat, string] {
        // null check
        if (value?.trim().length == 0) return null;

        // fill and then null check
        let main = new RegExp(this.regexMainFormat).exec(value);
        // check based on main value
        let justText = main != null
            ? this.regexCheckBrackets(" " + main[5] + main[6] + main[7] + " ")
            : this.regexCheckBrackets(" " + value + " ");

        // short hex format
        if (main != null && main[2] != null) return [ColorFormat.HEX, main[2]];
        return this.regexCheckValue(justText != null ? justText : value, main != null ? main[4] : null);
    }

    // ---
    // private functions
    // ---

    private static regexCheckBrackets(value: string): string {
        // brackets check for long format
        let inner = new RegExp(this.regexBrackets).exec(value);
        if (inner == null) return null;

        // by-pass first element, because it is almost same as default
        for (let i = 2; i < inner.length; i++) { if (inner[i] != null) return inner[i]; }
        return null;
    }

    private static regexCheckValue(value: string, type: string): [ColorFormat, string] {
        // check inner value
        let inner = new RegExp(this.regexValueFormat).exec(value);
        if (inner == null) return null;

        // long HEX & RGB & HSL format 
        if (type == null) {
            // long HEX
            if (inner[2] != null) return [ColorFormat.HEX, inner[2]];
            // long RGB
            if (inner[4] != null) return [ColorFormat.RGB, inner[4]];
            // long HSL
            if (inner[5] != null) return [ColorFormat.HSL, inner[5]];
        }

        // long HEX
        if (type?.toUpperCase() == ColorFormat[ColorFormat.HEX] && inner[2] != null)
            return [ColorFormat.HEX, inner[2]];
        // long RGB
        if (type?.toUpperCase() == ColorFormat[ColorFormat.RGB] && inner[4] != null)
            return [ColorFormat.RGB, inner[4]];
        // long HSL, there can be no degree symbol
        if (type?.toUpperCase() == ColorFormat[ColorFormat.HSL] && (inner[4] != null || inner[5] != null))
            return [ColorFormat.HSL, inner[4] != null ? inner[4] : inner[5]];

        // worst case, return null
        return null;
    }
}