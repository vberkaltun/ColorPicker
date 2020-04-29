import * as convert from 'color-convert';

export enum ColorFormat { Idle, HEX, RGB, HSL };
export class Color {

    // ---
    // variables and const
    // ---

    // INDEX 1: HEX
    private readonly regexJustHEX: RegExp = /^\s*(([a-fA-F0-9]{3}){1,2})\s*$/g;
    // INDEX 2: DIGIT 1, R
    // INDEX 4: DIGIT 2, G
    // INDEX 6: DIGIT 3, B
    private readonly regexJustRGB: RegExp = /^\s*(([0-9]|[1-9][0-9]|[1][0-9][0-9]|2[0-4][0-9]|25[0-5])\s*(\s+|[,]|[;])\s*([0-9]|[1-9][0-9]|[1][0-9][0-9]|2[0-4][0-9]|25[0-5])\s*(\s+|[,]|[;])\s*([0-9]|[1-9][0-9]|[1][0-9][0-9]|2[0-4][0-9]|25[0-5]))\s*$/g;
    // INDEX 2: DIGIT 1, R
    // INDEX 5: DIGIT 2, G
    // INDEX 8: DIGIT 3, B
    private readonly regexJustHSL: RegExp = /^\s*(([0-9]|[1-9][0-9]|[1-2][0-9][0-9]|3[0-5][0-9]|360)\s*([°]|[%])?\s*(\s+|[,]|[;])\s*([0-9]|[1-9][0-9]|100)\s*([°]|[%])?\s*(\s+|[,]|[;])\s*([0-9]|[1-9][0-9]|100)\s*([°]|[%])?)\s*$/g;

    // default colors
    private readonly defaultHEX = "000000";
    private readonly defaultRGB = [0, 0, 0];
    private readonly defaultHSL = [0, 0, 0];

    public _hex: any = this.defaultHEX;
    public _rgb: any = this.defaultRGB;
    public _hsl: any = this.defaultHSL;
    public _isColorSet: any = false;

    public get hex(): string { return "#" + this._hex; }
    public get rgb(): string { return "rgb(" + this._rgb[0] + ", " + this._rgb[1] + ", " + this._rgb[2] + ")"; }
    public get hsl(): string { return "hsl(" + this._hsl[0] + ", " + this._hsl[1] + ", " + this._hsl[2] + ")"; }
    public get gui(): string { return "rgb(" + this._rgb[0] + ", " + this._rgb[1] + ", " + this._rgb[2] + ",0.75)"; }
    public get isColorSet(): boolean { return this._isColorSet; }

    // ---
    // public functions
    // ---

    public resetColor() {
        this._hex = this.defaultHEX;
        this._rgb = this.defaultRGB;
        this._hsl = this.defaultHSL;

        this._isColorSet = false;
    }

    public setColor(value: [ColorFormat, string]) {
        // first reset all color values to default
        this.resetColor();

        // reflection solution
        let main = new RegExp(this?.["regexJust" + ColorFormat[value[0]]]).exec(value[1]);
        if (main == null) return;

        switch (value[0]) {
            case ColorFormat.HEX:
                this.setColorBatch(value[0], main[1]);
                break;
            case ColorFormat.RGB:
                this.setColorBatch(value[0], [main[2], main[4], main[6]]);
                break;
            case ColorFormat.HSL:
                this.setColorBatch(value[0], [main[2], main[5], main[8]]);
                break;
        }

        this._isColorSet = true;
    }

    private setColorBatch(type: ColorFormat, value: any) {
        // scan all enum values, except of idle case
        for (let item in ColorFormat) {
            if (isNaN(Number(item))) continue;
            if (item == ColorFormat.Idle.toString()) continue;

            try {
                let result = value;
                if (ColorFormat[type].toLowerCase() != ColorFormat[item].toLowerCase())
                    result = convert?.[ColorFormat[type].toLowerCase()]?.[ColorFormat[item].toLowerCase()](value);

                switch (ColorFormat[ColorFormat[item]]) {
                    case ColorFormat.HEX:
                        this._hex = result;
                        break;
                    case ColorFormat.RGB:
                        this._rgb = result;
                        break;
                    case ColorFormat.HSL:
                        this._hsl = result;
                        break;
                }
            }
            catch (Exception) { }
        }
    }
}