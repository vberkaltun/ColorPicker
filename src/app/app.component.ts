import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatRipple } from '@angular/material/core';

import { ColorExtended, ColorType, ColorGUI, ColorFormat } from './module.color';
import { Match } from './module.match';
import { SampleList } from './module.sample';

export const COLOR_MIN: number = -1;
export const COLOR_MAX: number = 256;

export const COLOR_BALANCED_MIN: number = 0;
export const COLOR_BALANCED_MAX: number = 255;

export const ALPHA_MIN: number = 0;
export const ALPHA_MAX: number = 100;

export enum SearchFormat { Increment, Decrement };

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

    // ---
    // variables and const
    // ---

    @ViewChild(MatRipple) ripple: MatRipple;
    public title = 'RGB to RGBA ColorPicker';
    public constructor(private snackBar: MatSnackBar) { }
    public ngOnInit(): void { this.init(); }

    public colorFore: ColorGUI = new ColorGUI();
    public colorBack: ColorGUI = new ColorGUI();
    public colorAlpha: ColorExtended = new ColorExtended();

    public inputFore: string = null;
    public inputBack: string = null;

    // we will get a sample from sample list
    private sampleList: SampleList = new SampleList();

    // ---
    // trigger events
    // ---

    public onForeValueChange(value: string = this.inputFore) {
        // first reset all color values to default
        this.colorFore.resetColor();
        this.colorAlpha.resetColor();

        let color = Match.regexCheckFormat(value);
        if (color == null) return;

        this.colorFore.setColor(color[0], color[1]);
        this.calculateAlphaColorBatch();
    }

    public onBackValueChange(value: string = this.inputBack) {
        // first reset all color values to default
        this.colorBack.resetColor();
        this.colorAlpha.resetColor();

        let color = Match.regexCheckFormat(value);
        if (color == null) return;

        this.colorBack.setColor(color[0], color[1]);
        this.calculateAlphaColorBatch();
    }

    public onPaste(value: ColorType) {
        navigator.clipboard.readText()
            .then(text => {
                text = text?.trim();
                switch (value) {
                    case ColorType.Fore:
                        this.inputFore = text;
                        this.onForeValueChange();
                        break;
                    case ColorType.Back:
                        this.inputBack = text;
                        this.onBackValueChange();
                        break;

                    default:
                        break;
                }
            })
            .catch();
    }

    public onClear(value: ColorType) {
        switch (value) {
            case ColorType.Fore:
                this.inputFore = null;
                this.onForeValueChange();
                break;
            case ColorType.Back:
                this.inputBack = null;
                this.onBackValueChange();
                break;

            default:
                break;
        }
    }

    public openSnackBar() {
        this.snackBar.open("Copied to clipboard!", "OK", {
            duration: 2000,
        });
    }

    public onRippleEffect() {
        this.ripple?.launch({
            centered: true,
        });
    }

    // ---
    // functions 
    // ---

    private init() {
        let random = this.sampleList.getRandomColor();
        this.inputFore = random.rgbFore;
        this.inputBack = random.rgbBack;

        console.log(random.rgbFore);
        console.log(random._rgbFore);

        this.onForeValueChange();
        this.onBackValueChange();
    }

    private calculateAlphaColorBatch() {
        if (!this.calculateAlphaColor(SearchFormat.Increment))
            this.calculateAlphaColor(SearchFormat.Decrement);

        // grayscale check
        this.calculateGrayScaleAlphaColor();
    }

    private calculateAlphaColor(type: SearchFormat): boolean {
        for (let alpha = type == SearchFormat.Increment ? ALPHA_MIN : ALPHA_MAX;
            type == SearchFormat.Increment ? alpha <= ALPHA_MAX : alpha >= ALPHA_MIN;
            type == SearchFormat.Increment ? alpha++ : alpha--) {

            let a = alpha / ALPHA_MAX;
            let r = (this.colorFore._rgb[0] - this.colorBack._rgb[0] + (this.colorBack._rgb[0] * a)) / a;
            let g = (this.colorFore._rgb[1] - this.colorBack._rgb[1] + (this.colorBack._rgb[1] * a)) / a;
            let b = (this.colorFore._rgb[2] - this.colorBack._rgb[2] + (this.colorBack._rgb[2] * a)) / a;

            // yes, I know it is looking veey bad but there is no another way...
            if (type == SearchFormat.Increment ?
                r < COLOR_MIN || g < COLOR_MIN || b < COLOR_MIN :
                r < COLOR_MAX && g < COLOR_MAX && b < COLOR_MAX) continue;

            if ((r < COLOR_MIN || r > COLOR_MAX) ||
                (g < COLOR_MIN || g > COLOR_MAX) ||
                (b < COLOR_MIN || b > COLOR_MAX))
                continue;

            if (isNaN(r) || r == Number.POSITIVE_INFINITY || r == Number.NEGATIVE_INFINITY) break;
            if (isNaN(g) || g == Number.POSITIVE_INFINITY || g == Number.NEGATIVE_INFINITY) break;
            if (isNaN(b) || b == Number.POSITIVE_INFINITY || b == Number.NEGATIVE_INFINITY) break;

            r = Math.floor(r);
            g = Math.floor(g);
            b = Math.floor(b);

            r = r == COLOR_MAX ? COLOR_BALANCED_MAX : r;
            g = g == COLOR_MAX ? COLOR_BALANCED_MAX : g;
            b = b == COLOR_MAX ? COLOR_BALANCED_MAX : b;

            r = r == COLOR_MIN ? COLOR_BALANCED_MIN : r;
            g = g == COLOR_MIN ? COLOR_BALANCED_MIN : g;
            b = b == COLOR_MIN ? COLOR_BALANCED_MIN : b;

            this.colorAlpha.setColorBatch(ColorFormat.RGB, [r, g, b, a]);
            if (this.colorAlpha.rgb == this.colorFore.rgb) break;

            console.log("Color OK:" + [r, g, b, a]);
            this.onRippleEffect();
            return this.colorAlpha._isColorSet = true;
        }

        // worst case
        return false;
    }

    private calculateGrayScaleAlphaColor(): boolean {
        // make grayscale calculation
        if (this.colorFore.isGrayScale && this.colorBack.isGrayScale) {
            let a = (this.colorFore._rgb[0] - this.colorBack._rgb[0]) / (255 - this.colorBack._rgb[0]);
            this.colorAlpha._grayScale = a;

            console.log("GrayScale OK:" + [255, 255, 255, a]);
            return this.colorAlpha._isGrayScale = true;
        }

        // worst case
        return false;
    }
} 