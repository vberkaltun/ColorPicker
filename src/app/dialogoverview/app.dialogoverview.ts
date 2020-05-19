import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'dialog-overview',
    templateUrl: 'app.dialogoverview.html',
    styleUrls: ['./app.dialogoverview.scss'],
})
export class DialogOverview {

    constructor(public dialogRef: MatDialogRef<DialogOverview>) { }

    onClick(): void {
        this.dialogRef.close();
    }
}