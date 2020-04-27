import { Component, OnInit } from '@angular/core';

// INDEX 1: FULL HEX
// INDEX 2: HEX INSIDE
// INDEX 3: FULL HSL & RGB & HEX
// INDEX 4: TYPE
// INDEX 5: BRACKETS
// INDEX 6: HSL & RGB & HEX INSIDE
// INDEX 7: BRACKETS
export const regexMainFormat: RegExp = /^\s*(#?\s*(([a-zA-Z0-9]{3}){1,2})|([R|r][G|g][B|b]|[H|h][S|s][L|l]|[H|h][E|e][X|x])?\s*([\s]+|[\[]|[\(]|[\{])([a-zA-Z0-9\s,;°%]*)([\s]*|[\]]|[\)]|[\}]))\s*$/g;
// INDEX 2: s
// INDEX 3: [
// INDEX 4: (
// INDEX 5: {
export const regexBrackets: RegExp = /^\s*(\s{1}([a-zA-Z0-9\s,;°%]*)\s{1}|\[{1}([a-zA-Z0-9\s,;°%]*)\]{1}|\({1}([a-zA-Z0-9\s,;°%]*)\){1}|\{{1}([a-zA-Z0-9\s,;°%]*)\}{1})\s*$/g;
// INDEX 2: HEX
// INDEX 4: RGB
// INDEX 5: HSL
export const regexValueFormat: RegExp = /^\s*((([a-zA-Z0-9]{3}){1,2})|([0-9\s,;]*[^°%a-zA-Z]*)|([0-9\s,;°%]*[^a-zA-Z]*))\s*$/g;

// INDEX 1: HEX
export const regexJustHEX: RegExp = /^\s*(([a-fA-F0-9]{3}){1,2})\s*$/g;
// INDEX 2: DIGIT 1, R
// INDEX 4: DIGIT 2, G
// INDEX 6: DIGIT 3, B
export const regexJustRGB: RegExp = /^\s*(([0-9]*[0-9]*[0-9]*)?\s*(\s+|[,]|[;])\s*([0-9]*[0-9]*[0-9]*)?\s*(\s+|[,]|[;])\s*([0-9]*[0-9]*[0-9]*)?)\s*$/g;
// INDEX 2: DIGIT 2, R
// INDEX 4: DIGIT 5, G
// INDEX 6: DIGIT 8, B
export const regexJustHSL: RegExp = /^\s*(([0-9]*[0-9]*[0-9]*)?\s*([°]|[%])?\s*(\s+|[,]|[;])\s*([0-9]*[0-9]*[0-9]*)?\s*([°]|[%])?\s*(\s+|[,]|[;])\s*([0-9]*[0-9]*[0-9]*)?\s*([°]|[%])?)\s*$/g;

export enum ColorFormat { Idle, HEX, RGB, HSL }
export class Color {
    private r: number = 0;
    private g: number = 0;
    private b: number = 0;

    private hex: string = null;
    private format: ColorFormat = ColorFormat.Idle;

    public resetColors() {
        this.r = 0;
        this.g = 0;
        this.b = 0;
        
        this.hex = null;
        this.format = ColorFormat.Idle;
    }

    public getColor(withMask: boolean = true): string {
        switch (this.format) {
            case ColorFormat.HEX:
                return (withMask ? "#" : null) + this.hex;
            case ColorFormat.RGB:
                return (withMask ? "rgb(" : null) +
                    this.r + "," +
                    this.g + "," +
                    this.b +
                    (withMask ? ")" : null);
            case ColorFormat.HSL:
                return (withMask ? "hsl(" : null) +
                    this.r + "," +
                    this.g + "%," +
                    this.b + "%" +
                    (withMask ? ")" : null);

            default:
            case ColorFormat.Idle:
                return "rgb(0,0,0, 0.5)";
        }
    }
    public setColor(value: [ColorFormat, string]) {
        switch (value[0]) {
            case ColorFormat.HEX:
                this.setHEX(value[1]);
                this.format = ColorFormat.HEX;
                break;

            case ColorFormat.RGB:
                this.setRGB(value[1]);
                this.format = ColorFormat.RGB;
                break;

            case ColorFormat.HSL:
                this.setHSL(value[1]);
                this.format = ColorFormat.HSL;
                break;

            default:
            case ColorFormat.Idle:
                this.hex = "000";
                this.format = ColorFormat.Idle;
                break;
        }
    }

    public setHEX(value: string) {
        // fill and then null check
        let main = new RegExp(regexJustHEX).exec(value);
        if (main == null) return;

        this.hex = main[1];
        console.log(main);
    }
    public setRGB(value: string) {
        // fill and then null check
        let main = new RegExp(regexJustRGB).exec(value);
        if (main == null) return;

        this.r = Number(main[2]);
        this.g = Number(main[4]);
        this.b = Number(main[6]);
        console.log(main);
    }
    public setHSL(value: string) {
        // fill and then null check
        let main = new RegExp(regexJustHSL).exec(value);
        if (main == null) return;

        this.r = Number(main[2]);
        this.g = Number(main[5]);
        this.b = Number(main[8]);
        console.log(main);
    }
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

    // ---
    // variables and const
    // ---

    public title = 'RGB to RGBA ColorPicker';
    public ngOnInit(): void { }

    private colorFore: Color = new Color();
    private colorBack: Color = new Color();

    private colorForeResult: string = null;
    private colorBackResult: string = null;

    // ---
    // trigger events
    // ---

    public onForeValueChange(value: string) {
        let color = this.regexCheckFormat(value);
        if (color == null) return;

        this.colorFore.setColor(color);
        this.colorForeResult = this.colorFore.getColor();
    }

    public onBackValueChange(value: string) {
        let color = this.regexCheckFormat(value);
        if (color == null) return;

        this.colorBack.setColor(color);
        this.colorBackResult = this.colorBack.getColor();
    }

    // ---
    // regex calculations
    // ---

    private regexCheckFormat(value: string): [ColorFormat, string] {
        // null check
        if (value.trim().length == 0) return null;

        // fill and then null check
        let main = new RegExp(regexMainFormat).exec(value);
        // check based on main value
        let justText = main != null
            ? this.regexCheckBrackets(" " + main[5] + main[6] + main[7] + " ")
            : this.regexCheckBrackets(" " + value + " ");

        // short hex format
        if (main != null && main[2] != null) return [ColorFormat.HEX, main[2]];
        return this.regexCheckValue(justText != null ? justText : value, main != null ? main[4] : null);
    }
    private regexCheckBrackets(value: string): string {
        // brackets check for long format
        let inner = new RegExp(regexBrackets).exec(value);
        if (inner == null) return null;

        // by-pass first element, because it is almost same as default
        for (let i = 2; i < inner.length; i++) { if (inner[i] != null) return inner[i]; }
        return null;
    }

    private regexCheckValue(value: string, type: string): [ColorFormat, string] {
        // check inner value
        let inner = new RegExp(regexValueFormat).exec(value);
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