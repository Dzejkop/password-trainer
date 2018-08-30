import Exercise from "./exercise";
import Levenshtein from "../utils/levenshteinDistance";

export default class FullExercise implements Exercise {
    constructor(private readonly password: string) {
        this.description = "Enter your full password";
    }

    readonly description: string;

    attempt(pass: string): boolean {
        return this.password === pass;
    }

    resultReport(pass: string): string {
        return `You were wrong by a total of ${Levenshtein(this.password, pass)} characters.`;
    }
}