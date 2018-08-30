import Exercise from "./exercise";
import getRandomInt from "../utils/randomInt";

export default class LastPartExercise implements Exercise {
    private readonly size : number;

    constructor(private readonly password: string) {
        this.size = getRandomInt(1, Math.floor(this.password.length / 2));
        this.description = `Enter the last ${this.size} characters of your password\n `
            + `${this.visualCue(this.password, this.size)}`;
    }

    private visualCue(pass: string, lastX : number) : string {
        let s = "";
        for (let i = 0; i < pass.length; i++) {
            if (i >= pass.length - lastX) {
                s += "X";
            } else {
                s += "*";
            }
        }

        return s;
    }

    readonly description: string;

    attempt(pass: string): boolean {
        return pass === this.password.slice(-this.size);
    }

    resultReport(pass: string): string {
        return `Expected ${this.password.slice(-this.size)} got ${pass}`;
    }
}