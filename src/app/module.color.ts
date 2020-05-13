import * as convert from 'color-convert';

export enum ColorType { Back, Fore };
export enum ColorFormat { Idle, HEX, RGB, HSL };

export class Color {

    // ---
    // variables and const
    // ---

    // INDEX 1: HEX
    protected readonly regexJustHEX: RegExp = /^\s*(([a-fA-F0-9]{3}){1,2})\s*$/g;
    // INDEX 2: DIGIT 1, R
    // INDEX 4: DIGIT 2, G
    // INDEX 6: DIGIT 3, B
    protected readonly regexJustRGB: RegExp = /^\s*(([0-9]|[1-9][0-9]|[1][0-9][0-9]|2[0-4][0-9]|25[0-5])\s*(\s+|[,]|[;])\s*([0-9]|[1-9][0-9]|[1][0-9][0-9]|2[0-4][0-9]|25[0-5])\s*(\s+|[,]|[;])\s*([0-9]|[1-9][0-9]|[1][0-9][0-9]|2[0-4][0-9]|25[0-5]))\s*$/g;
    // INDEX 2: DIGIT 1, R
    // INDEX 5: DIGIT 2, G
    // INDEX 8: DIGIT 3, B
    protected readonly regexJustHSL: RegExp = /^\s*(([0-9]|[1-9][0-9]|[1-2][0-9][0-9]|3[0-5][0-9]|360)\s*([°]|[%])?\s*(\s+|[,]|[;])\s*([0-9]|[1-9][0-9]|100)\s*([°]|[%])?\s*(\s+|[,]|[;])\s*([0-9]|[1-9][0-9]|100)\s*([°]|[%])?)\s*$/g;

    // default colors
    protected readonly defaultHEX = "000000";
    protected readonly defaultRGB = [0, 0, 0, 1];
    protected readonly defaultHSL = [0, 0, 0, 1];

    // ---

    public _hex: any = this.defaultHEX;
    public _rgb: any = this.defaultRGB;
    public _hsl: any = this.defaultHSL;

    public get hex(): string { return "#" + this._hex; }
    public get rgb(): string { return "rgb(" + this._rgb[0] + ", " + this._rgb[1] + ", " + this._rgb[2] + ")"; }
    public get hsl(): string { return "hsl(" + this._hsl[0] + ", " + this._hsl[1] + ", " + this._hsl[2] + ")"; }

    public _isColorSet: any = false;
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

    public setColor(type: ColorFormat, value: any) {
        // first reset all color values to default
        this.resetColor();

        // reflection solution
        let main = new RegExp(this?.["regexJust" + ColorFormat[type]]).exec(value);
        if (main == null) return;

        switch (type) {
            case ColorFormat.HEX:
                this.setColorBatch(type, main[1]);
                break;
            case ColorFormat.RGB:
                this.setColorBatch(type, [main[2], main[4], main[6], 1]);
                break;
            case ColorFormat.HSL:
                this.setColorBatch(type, [main[2], main[5], main[8], 1]);
                break;
        }

        this._isColorSet = true;
    }

    public setColorBatch(type: ColorFormat, value: any) {
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

export class ColorGUI extends Color {
    // default colors
    protected readonly defaultTransparent = 0.75;

    // ui color hotfix
    public get gui(): string {
        return "rgba(" + this._rgb[0] + ", " + this._rgb[1] + ", " + this._rgb[2] + ", "
            + this.defaultTransparent + ")";
    }
    public get border(): string {
        return "0px 5px 10px "
            + "rgba(" + this._rgb[0] + ", " + this._rgb[1] + ", " + this._rgb[2] + ", " + 0.15 + ")" + ", 0px 20px 20px "
            + "rgba(" + this._rgb[0] + ", " + this._rgb[1] + ", " + this._rgb[2] + ", " + 0.15 + ")";
    }

    public get isGrayScale(): boolean {
        return this._rgb[0] == this._rgb[1]
            && this._rgb[0] == this._rgb[2];
    }
}

export class ColorExtended extends Color {

    // ---
    // variables and const
    // ---

    // default colors
    protected readonly defaultGrayScale = 0.0;
    protected readonly defaultFixedAlpha = 0.4;

    // additional for result box
    public get hexWithAlpha(): string { return "#" + (Math.round(this._rgb[3] * 255) + 0x10000).toString(16).substr(-2).toUpperCase() + this._hex; }
    public get rgbWithAlpha(): string { return "rgb(" + this._rgb[0] + ", " + this._rgb[1] + ", " + this._rgb[2] + ", " + this._rgb[3] + ")"; }
    public get hslWithAlpha(): string { return "hsl(" + this._hsl[0] + ", " + this._hsl[1] + ", " + this._hsl[2] + ", " + this._rgb[3] + ")"; }

    public get hexWithFixedAlpha(): string { return "#" + (Math.round(this.defaultFixedAlpha * 255) + 0x10000).toString(16).substr(-2).toUpperCase() + this._hex; }
    public get rgbWithFixedAlpha(): string { return "rgb(" + this._rgb[0] + ", " + this._rgb[1] + ", " + this._rgb[2] + ", " + this.defaultFixedAlpha + ")"; }
    public get hslWithFixedAlpha(): string { return "hsl(" + this._hsl[0] + ", " + this._hsl[1] + ", " + this._hsl[2] + ", " + this.defaultFixedAlpha + ")"; }

    // grayscale result
    public get hexWithGrayScale(): string { return this.getHEXFormat((Math.round(this._grayScale * 255) + 0x10000).toString(16).substr(-2).toUpperCase()); }
    public get rgbWithGrayScale(): string { return this.getRGBFormat(Math.round(this._grayScale * 100) / 100); }
    public get hslWithGrayScale(): string { return this.getHSLFormat(Math.round(this._grayScale * 100) / 100); }

    // ---

    public _grayScale: any = this.defaultGrayScale;
    public _isGrayScale: any = false;
    public _isGrayScaleForeHigh: any = false;

    public get grayScale(): number { return this._grayScale; }
    public get isGrayScale(): boolean { return this._isGrayScale; }
    public get isGrayScaleHighBound(): number { return this._isGrayScaleForeHigh; }

    // ---
    // public functions
    // ---

    public resetColor() {
        // call base member
        super.resetColor();

        this._grayScale = this.defaultGrayScale;
        this._isGrayScale = false;
        this._isGrayScaleForeHigh = false;
    }

    // ---
    // private functions
    // ---

    // grayscale formatter with high bound value
    private getHEXFormat(value: any): string { return "#" + value + ((this._isGrayScaleForeHigh) ? "FFFFFF" : "000000") };
    private getRGBFormat(value: any): string { return ((this._isGrayScaleForeHigh) ? "rgb(255, 255, 255, " : "rgb(0, 0, 0, ") + value + ")" };
    private getHSLFormat(value: any): string { return ((this._isGrayScaleForeHigh) ? "hsl(0, 0, 100, " : "hsl(0, 0, 0, ") + value + ")" };
}