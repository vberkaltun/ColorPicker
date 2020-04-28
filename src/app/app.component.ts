import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Color } from './regex.color';
import { Match } from './regex.match';

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

    // ---
    // trigger events
    // ---

    public onForeValueChange(value: string) {
        this.colorFore.resetColor();
        let color = Match.regexCheckFormat(value);
        if (color == null) return;
        
        this.colorFore.setColor(color);
    }
    public onBackValueChange(value: string) {
        this.colorBack.resetColor();
        let color = Match.regexCheckFormat(value);
        if (color == null) return;

        this.colorBack.setColor(color);
    }

    public openSnackBar() {
        this.snackBar.open("Copied to clipboard!", "OK", {
            duration: 2000,
        });
    }
}