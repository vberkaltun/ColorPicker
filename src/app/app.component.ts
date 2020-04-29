import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Color, ColorFormat } from './regex.color';
import { Match } from './regex.match';

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

    public title = 'RGB to RGBA ColorPicker';
    public constructor(private snackBar: MatSnackBar) { }
    public ngOnInit(): void { }

    public colorFore: Color = new Color();
    public colorBack: Color = new Color();
    public colorAlpha: Color = new Color();

    // ---
    // trigger events
    // ---

    public onForeValueChange(value: string) {
        this.colorFore.resetColor();
        let color = Match.regexCheckFormat(value);
        if (color == null) return;

        this.colorFore.setColor(color[0], color[1]);
        this.calculateAlphaColorBatch();
    }

    public onBackValueChange(value: string) {
        this.colorBack.resetColor();
        let color = Match.regexCheckFormat(value);
        if (color == null) return;

        this.colorBack.setColor(color[0], color[1]);
        this.calculateAlphaColorBatch();
    }

    public openSnackBar() {
        this.snackBar.open("Copied to clipboard!", "OK", {
            duration: 2000,
        });
    }

    // ---
    // functions 
    // ---

    private calculateAlphaColorBatch() {
        if (!this.calculateAlphaColor(SearchFormat.Increment))
            this.calculateAlphaColor(SearchFormat.Decrement);
    }

    private calculateAlphaColor(type: SearchFormat): boolean {
        // first reset all color values to default
        this.colorAlpha.resetColor();

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

            if (r == Number.NaN || r == Number.POSITIVE_INFINITY || r == Number.NEGATIVE_INFINITY) break;
            if (g == Number.NaN || g == Number.POSITIVE_INFINITY || g == Number.NEGATIVE_INFINITY) break;
            if (b == Number.NaN || b == Number.POSITIVE_INFINITY || b == Number.NEGATIVE_INFINITY) break;

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
            return this.colorAlpha._isColorSet = true;
        }

        // worst case
        return false;
    }
} 