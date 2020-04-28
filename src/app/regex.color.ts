import * as convert from 'color-convert';

export enum ColorFormat { Idle, HEX, RGB, HSL };
export class Color {

    // ---
    // variables and const
    // ---

    // default colors
    private readonly defaultHEX = "#000000";
    private readonly defaultRGB = "rgb(0, 0, 0)";
    private readonly defaultHSL = "rgb(0, 0, 0)";
    private readonly defaultColorUI = "rgb(0, 0, 0, 0.75)";

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

    public hex: string = this.defaultHEX;
    public rgb: string = this.defaultRGB;
    public hsl: string = this.defaultHSL;

    public colorUI: string = this.defaultColorUI;
    public isColorSet: boolean = false;

    // ---
    // public functions
    // ---

    public resetColor() {
        this.hex = this.defaultHEX;
        this.rgb = this.defaultRGB;
        this.hsl = this.defaultHSL;

        this.colorUI = this.defaultColorUI;
        this.isColorSet = false;
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

        this.isColorSet = true;
    }

    private setColorBatch(type: ColorFormat, value: any) {
        this.setNumericHEX(type, value);
        this.setNumericRGB(type, value);
        this.setNumericHSL(type, value);
    }

    // ---
    // regex calculations
    // ---

    private setNumericHEX(type: ColorFormat, value: any) {
        try { value = convert?.[ColorFormat[type].toLowerCase()].hex(value); }
        catch (Exception) { }
        this.hex = "#" + value;
    }
    private setNumericRGB(type: ColorFormat, value: any) {
        try { value = convert?.[ColorFormat[type].toLowerCase()].rgb(value) }
        catch (Exception) { }
        this.rgb = "rgb(" + value[0] + ", " + value[1] + ", " + value[2] + ")";

        // this will be applied to UI color
        this.colorUI = "rgb(" + value[0] + ", " + value[1] + ", " + value[2] + ", 0.75)";
    }
    private setNumericHSL(type: ColorFormat, value: any) {
        try { value = convert?.[ColorFormat[type].toLowerCase()].hsl(value) }
        catch (Exception) { }
        this.hsl = "hsl(" + value[0] + ", " + value[1] + "%, " + value[2] + "%)";
    }
}