import { Component, OnInit } from '@angular/core';
import { IfStmt } from '@angular/compiler';

export const regexMainFormat: RegExp = /^\s*(#?\s*(([a-zA-Z0-9]{3}){1,2})|([R|r][G|g][B|b]|[H|h][S|s][L|l]|[H|h][E|e][X|x])?\s*([\s]+|[\[]|[\(]|[\{])([a-zA-Z0-9\s,;°]*)([\s]*|[\]]|[\)]|[\}]))\s*$/g;
export const regexBrackets: RegExp = /^\s*(\s{1}([a-zA-Z0-9\s,;°]*)\s{1}|\[{1}([a-zA-Z0-9\s,;°]*)\]{1}|\({1}([a-zA-Z0-9\s,;°]*)\){1}|\{{1}([a-zA-Z0-9\s,;°]*)\}{1})\s*$/g;
export const regexValueFormat: RegExp = /^\s*((([a-zA-Z0-9]{3}){1,2})|([0-9\s,;]*[^°a-zA-Z]*)|([0-9\s,;°]*[^a-zA-Z]*))\s*$/g;

export enum ColorFormat { Idle, RGB, HSL, HEX }

export class Color {
    R: number = 0;
    G: number = 0;
    B: number = 0;
    A: number = 0;

    public getHSL(withMask: boolean = true): string { return null; }
    public getRGB(withMask: boolean = true): string { return null; }
    public getHEX(withMask: boolean = true): string { return null; }

    public setHSL(value: string): boolean { return false; }
    public setRGB(value: string): boolean { return false; }
    public setHEX(value: string): boolean { return false; }
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

    private colorFore: string = null;
    private colorBack: string = null;

    // ---
    // trigger events
    // ---

    public onForeValueChange(value: string) {
        this.colorFore = value;
        let x = this.calculateRegex(value);
        console.log(ColorFormat[x[0]]);
    }

    public onBackValueChange(value: string) {
        this.colorBack = value;
        let x = this.calculateRegex(value);
        console.log(ColorFormat[x[0]]);
    }

    // ---
    // regex calculations
    // ---

    private calculateRegex(value: string): [ColorFormat, string] {
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