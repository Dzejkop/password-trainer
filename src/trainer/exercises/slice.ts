import Exercise from "./exercise";
import getRandomInt from "../utils/randomInt";

export default class SliceExercise implements Exercise {
    private readonly startIndex : number;
    private readonly endIndex : number;

    constructor(private readonly password: string) {
        this.startIndex = getRandomInt(0, this.password.length - 2);
        this.endIndex = getRandomInt(this.startIndex + 1, this.password.length - 1);
        const total = this.endIndex - this.startIndex;
        this.description = `Enter ${total} characters starting at position ${this.startIndex + 1}\n`
            + `${SliceExercise.visualCue(this.password, this.startIndex, this.endIndex)}`;
    }

    private static visualCue(pass: string, startIndex : number, endIndex : number) : string {
        let s = "";
        for (let i = 0; i < pass.length; i++) {
            if (i >= startIndex && i < endIndex) {
                s += "X";
            } else {
                s += "*";
            }
        }

        return s;
    }

    readonly description: string;

    attempt(pass: string): boolean {
        return pass === this.password.slice(this.startIndex, this.endIndex);
    }

    resultReport(pass: string): string {
        return `Expected ${this.password.slice(this.startIndex, this.endIndex)} got ${pass}`;
    }
}