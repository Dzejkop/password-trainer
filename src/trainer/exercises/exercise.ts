export default interface Exercise {
    readonly description : string;
    attempt(pass: string) : boolean;
    resultReport(pass: string) : string;
}