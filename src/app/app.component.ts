import { Component, OnInit } from '@angular/core';
var convert = require('color-convert');

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
// INDEX 2: DIGIT 1, R
// INDEX 5: DIGIT 2, G
// INDEX 8: DIGIT 3, B
export const regexJustHSL: RegExp = /^\s*(([0-9]*[0-9]*[0-9]*)?\s*([°]|[%])?\s*(\s+|[,]|[;])\s*([0-9]*[0-9]*[0-9]*)?\s*([°]|[%])?\s*(\s+|[,]|[;])\s*([0-9]*[0-9]*[0-9]*)?\s*([°]|[%])?)\s*$/g;

export enum ColorFormat { Idle, HEX, RGB, HSL }
export class Color {
    private hex: string = null;
    private rgb: string = null;
    private hsl: string = null;

    public resetColor() {
        this.hex = "#000";
        this.rgb = "rgb(0,0,0)";
        this.hsl = "hsl(0,0,0)";
    }
    public setColor(value: [ColorFormat, string]) {
        switch (value[0]) {
            case ColorFormat.HEX:
                {
                    let main = new RegExp(regexJustHEX).exec(value[1]);
                    if (main == null) return;
                    this.setColorBatch(value[0], main[1]);
                }
                break;

            case ColorFormat.RGB:
                {
                    let main = new RegExp(regexJustRGB).exec(value[1]);
                    if (main == null) return;
                    this.setColorBatch(value[0], [main[2], main[4], main[6]]);
                }
                break;

            case ColorFormat.HSL:
                {
                    let main = new RegExp(regexJustHSL).exec(value[1]);
                    if (main == null) return;
                    this.setColorBatch(value[0], [main[2], main[5], main[8]]);
                }
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

    private setNumericHEX(type: ColorFormat, value: any) {
        let main;
        try { main = convert?.[ColorFormat[type].toLowerCase()].hex(value); }
        catch (Exception) { main = value; }

        this.hex = "#" + main;
    }

    private setNumericRGB(type: ColorFormat, value: any) {
        let main;
        try { main = convert?.[ColorFormat[type].toLowerCase()].rgb(value) }
        catch (Exception) { main = value; }
        this.rgb = "rgb(" + main[0] + ", " + main[1] + ", " + main[2] + ", 0.85)";
    }

    private setNumericHSL(type: ColorFormat, value: any) {
        let main;
        try { main = convert?.[ColorFormat[type].toLowerCase()].hsl(value) }
        catch (Exception) { main = value; }

        this.hsl = "hsl(" + main[0] + ", " + main[1] + "%, " + main[2] + "%)";
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

    // ---
    // trigger events
    // ---

    public onForeValueChange(value: string) {
        let color = this.regexCheckFormat(value);
        if (color == null) return;
        this.colorFore.setColor(color);
    }

    public onBackValueChange(value: string) {
        let color = this.regexCheckFormat(value);
        if (color == null) return;
        this.colorBack.setColor(color);
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