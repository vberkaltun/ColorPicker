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
    private readonly regexJustRGB: RegExp = /^\s*(([0-9]*[0-9]*[0-9]*)?\s*(\s+|[,]|[;])\s*([0-9]*[0-9]*[0-9]*)?\s*(\s+|[,]|[;])\s*([0-9]*[0-9]*[0-9]*)?)\s*$/g;
    // INDEX 2: DIGIT 1, R
    // INDEX 5: DIGIT 2, G
    // INDEX 8: DIGIT 3, B
    private readonly regexJustHSL: RegExp = /^\s*(([0-9]*[0-9]*[0-9]*)?\s*([°]|[%])?\s*(\s+|[,]|[;])\s*([0-9]*[0-9]*[0-9]*)?\s*([°]|[%])?\s*(\s+|[,]|[;])\s*([0-9]*[0-9]*[0-9]*)?\s*([°]|[%])?)\s*$/g;

    public hex: string = null;
    public rgb: string = null;
    public hsl: string = null;

    public colorUI: string = null;

    // ---
    // public functions
    // ---

    public resetColor() {
        this.hex = null;
        this.rgb = null;
        this.hsl = null;

        this.colorUI = null;
    }
    public setColor(value: [ColorFormat, string]) {
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

            default:
            case ColorFormat.Idle:
                this.resetColor();
                break;
        }
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