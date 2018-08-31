import * as blessed from "blessed";
import { Trainer } from "./trainer/trainer";
import Exercise from "./trainer/exercises/exercise";

const screen = blessed.screen();

const mainBox = blessed.box({
    label: "Password Trainer",
    border: "line",
    top: 'center',
    left: 'center',
    width: '50%',
    height: '50%',
});

const statusBar = blessed.box({
    height: 1,
    width: "100%-2",
    top: 0,
})

const mainContent = blessed.log({
    width: "100%-2",
    top: 1,
    height: "100%-5",
    align: "center",
    tags: true,
});

const input = blessed.textbox({
    bg: "green",
    height: 1,
    width: "100%-2",
    top: "100%-3",
});


const exitKeys = ["C-c", "escape"];
function exit() {
    process.exit(0);
}

input.key(exitKeys, exit);
screen.key(exitKeys, exit);

screen.render();

mainBox.append(input);
mainBox.append(statusBar);
mainBox.append(mainContent);

screen.append(mainBox);

function updateStatus(status: string) {
    statusBar.content = status;
}

function askForPassword() : Promise<string> {
    return new Promise((resolve, reject) => {
        input.censor = true;
        input.clearValue();
        mainContent.log("Enter your password.");
        screen.render();

        input.readInput((err, val) => {
            resolve(val);
            screen.render();
        });
    });
}

function executeExercise(exercise : Exercise) : Promise<string> {
    return new Promise((resolve, reject) => {
        mainContent.log(`Exercise:\n${exercise.description}`);
        screen.render();
        input.clearValue();

        input.readInput((err, val) => {
            if (err) {
                process.exit(0);
            }

            resolve(val);
            screen.render();
        });
    });
}

async function main() {
    const password = await askForPassword();
    const trainer = new Trainer(password);

    updateStatus("...");

    while (true) {
        const exercise = trainer.nextExercise();
        const answer = await executeExercise(exercise);

        const result = trainer.attemptExercise(answer, exercise);

        if (!result) {
            mainContent.log(`{bold}Wrong: ${exercise.resultReport(answer)}{/bold}`);
        }

        updateStatus(`${result ? "Good!" : "Wrong!"}` +
            ` - Right/Wrong ratio: ${trainer.status().succesfulAttempts}/${trainer.status().totalAttempts}` +
            ` - Profficiency: ${trainer.status().profficiency}`)
    }
}

main();