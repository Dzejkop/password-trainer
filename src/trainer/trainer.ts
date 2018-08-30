import Exercise from "./exercises/exercise";
import FullExercise from "./exercises/full";
import LastPartExercise from "./exercises/last";
import SliceExercise from "./exercises/slice";
import getRandomInt from "./utils/randomInt";

export interface ITrainer {
    nextExercise() : Exercise;
    status() : Status;

    attemptExercise(answer: string, exercise : Exercise) : boolean;
    reports() : string[];
}

export type Profficiency = number;

export type Status = {
    profficiency: Profficiency;
    totalAttempts : number;
    succesfulAttempts : number;
}

type Attempt = {
    password: string;
    exercise: Exercise;
    answer: string;
}

export class Trainer implements ITrainer {
    private attempts : Attempt[] = [];

    constructor(private readonly password: string)
    {
    }

    nextExercise(): Exercise {
        const exercises = this.getAvailableExercises();

        return new exercises[getRandomInt(0, exercises.length - 1)](this.password);
    }

    private getAvailableExercises() {
        const count = this.attempts.length;

        if (count > 10) {
            return [
                FullExercise,
                LastPartExercise,
                SliceExercise
            ];
        } else if (count > 5) {
            return [
                FullExercise,
                LastPartExercise,
            ];
        }

        return [ FullExercise ];
    }

    attemptExercise(answer: string, exercise: Exercise): boolean {
        this.attempts.push({
            password: this.password,
            exercise,
            answer
        });

        return exercise.attempt(answer);
    }

    reports(): string[] {
        return this.attempts
            .map(attempt => attempt.exercise.resultReport(attempt.answer));
    }

    status(): Status {
        const totalAttempts = this.attempts.length;
        const succesfulAttempts = this.attempts
            .filter(attempt => attempt.exercise.attempt(attempt.answer))
            .length;

        return {
            profficiency: 0,
            totalAttempts,
            succesfulAttempts,
        };
    }
}