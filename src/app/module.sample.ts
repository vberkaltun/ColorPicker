export class Sample {
    // default colors
    protected readonly defaultRGB = [0, 0, 0, 1];

    public _rgbFore: any = this.defaultRGB;
    public get rgbFore(): string { return "rgb(" + this._rgbFore[0] + ", " + this._rgbFore[1] + ", " + this._rgbFore[2] + ")"; }

    public _rgbBack: any = this.defaultRGB;
    public get rgbBack(): string { return "rgb(" + this._rgbBack[0] + ", " + this._rgbBack[1] + ", " + this._rgbBack[2] + ")"; }

    public constructor(fore: [number, number, number], back: [number, number, number]) {
        this._rgbFore = fore;
        this._rgbBack = back;
    }
}

export class SampleList {
    // sample list
    private sampleList: Array<Sample> = [];

    public constructor() {
        this.addColorSet(new Sample([0, 128, 128], [0, 255, 64]));
        this.addColorSet(new Sample([255, 0, 0], [128, 0, 64]));
        this.addColorSet(new Sample([192, 192, 192], [128, 128, 255]));
        this.addColorSet(new Sample([64, 0, 128], [255, 0, 128]));
        this.addColorSet(new Sample([192, 192, 192], [255, 128, 128]));
        this.addColorSet(new Sample([255, 128, 0], [255, 0, 0]));
        this.addColorSet(new Sample([192, 192, 192], [128, 128, 128]));
        this.addColorSet(new Sample([192, 192, 192], [128, 128, 255]));
        this.addColorSet(new Sample([192, 192, 192], [255, 128, 192]));
        this.addColorSet(new Sample([0, 128, 192], [0, 64, 128]));
        this.addColorSet(new Sample([64, 128, 128], [0, 0, 255]));
        this.addColorSet(new Sample([64, 0, 128], [255, 0, 128]));
        this.addColorSet(new Sample([64, 128, 128], [255, 0, 128]));
        this.addColorSet(new Sample([64, 128, 128], [0, 255, 0]));
        this.addColorSet(new Sample([192, 192, 192], [128, 255, 128]));
        this.addColorSet(new Sample([0, 128, 192], [0, 255, 0]));
        this.addColorSet(new Sample([192, 192, 192], [0, 128, 255]));
        this.addColorSet(new Sample([128, 128, 255], [255, 0, 255]));
        this.addColorSet(new Sample([255, 128, 64], [255, 0, 255]));
        this.addColorSet(new Sample([192, 192, 192], [255, 255, 128]));
    }

    public addColorSet(value: Sample) { if (this.sampleList.indexOf(value) == -1) this.sampleList.push(value); }
    public getRandomColor(): Sample { return this.sampleList[Math.floor(Math.random() * this.sampleList.length)] }
}