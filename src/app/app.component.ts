import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Color } from './regex.color';
import { Match } from './regex.match';

export const COLOR_MIN: number = -1;
export const COLOR_MAX: number = 256;
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

        this.colorFore.setColor(color);
        //console.log(this.calculateColor(SearchFormat.Increment));
    }
    public onBackValueChange(value: string) {
        this.colorBack.resetColor();
        let color = Match.regexCheckFormat(value);
        if (color == null) return;

        this.colorBack.setColor(color);
        //console.log(this.calculateColor(SearchFormat.Increment));
    }

    public openSnackBar() {
        this.snackBar.open("Copied to clipboard!", "OK", {
            duration: 2000,
        });
    }

    // ---
    // functions 
    // ---

    private calculateColor(type: SearchFormat): number[] {
        for (let alpha = type == SearchFormat.Increment ? 1 : ALPHA_MAX;
            type == SearchFormat.Increment ? alpha <= ALPHA_MAX : alpha >= 1;
            type == SearchFormat.Increment ? alpha++ : alpha--) {

            let a = alpha / ALPHA_MAX;
            let r = (this.colorFore._rgb[0] - this.colorBack._rgb[0] + (this.colorBack._rgb[0] * a)) / a;
            let g = (this.colorFore._rgb[1] - this.colorBack._rgb[1] + (this.colorBack._rgb[1] * a)) / a;
            let b = (this.colorFore._rgb[2] - this.colorBack._rgb[2] + (this.colorBack._rgb[2] * a)) / a;

            if (type == SearchFormat.Increment ?
                r < COLOR_MIN || g < COLOR_MIN || b < COLOR_MIN :
                r < COLOR_MAX && g < COLOR_MAX && b < COLOR_MAX)
                continue;

            r = r == COLOR_MAX ? 255 : r;
            g = g == COLOR_MAX ? 255 : g;
            b = b == COLOR_MAX ? 255 : b;
            r = r == COLOR_MIN ? 0 : r;
            g = g == COLOR_MIN ? 0 : g;
            b = b == COLOR_MIN ? 0 : b;

            return [r, g, b, a];
        }
    }
}