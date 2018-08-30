import * as blessed from "blessed";

const screen = blessed.screen({
    cursor: {
        artificial: true,
        shape: "block",
        color: "white",
        blink: true,
    },
    title: "Password trainer",
});

const box = blessed.box({
    align: "center",
    bg: "white",
    fg: "black",
    content: "Please enter the password you'd like to practice",
    tags: true,
})

const input = blessed.textbox({
    bg: "blue",
    width: "100%",
    height: 1,
    left: 0,
    top: Number(screen.height) - 2,
    valign: "middle",
    censor: true,
});

const help = blessed.box({
    bg: "blue",
    width: "100%",
    height: 1,
    left: 0,
    top: Number(screen.height) - 1,
    valign: "middle",
    content: "Esc to quit;",
});

screen.append(box);
screen.append(input);
screen.append(help);

screen.key(["C-c"], () => {
    return process.exit(0);
});

input.addListener("cancel", () => {
    process.exit(0);
})

screen.render();

class Program {
    private password? : string;
    private totalGuesses : number = 0;
    private correctGuesses : number = 0;

    private tries: string[] = [];

    constructor() {
        box.content = "Enter the password you'd like to practice";
        this.nextInput();
    }

    private attemptToStatusLine(attempt : string) : string {
        if (!this.password) {
            throw new Error();
        }
        let status = "";

        const top = Math.max(attempt.length, this.password.length);

        for (let i = 0; i < top; i++) {
            if (i >= attempt.length) {
                status += "{red-bg}-{/red-bg}";
            }
            else if (i >= this.password.length) {
                status += "{red-bg}+{/red-bg}";
            }
            else
            {
                if (attempt[i] === this.password[i]) {
                    status += "{green-bg}*{/green-bg}";
                } else {
                    status += "{red-bg}*{/red-bg}";
                }
            }
        }

        return status;
    }

    setContent() {
        if (this.password) {
            let lines = [
                "Enter the full password.",
                `Rate ${this.correctGuesses}/${this.totalGuesses}`,
            ];

            if (this.tries) {
                for (const attempt of this.tries) {
                    lines.push(this.attemptToStatusLine(attempt));
                }
            }

            box.content = lines.join("\n");

            box.render();
            this.nextInput();
        }
    }

    nextInput() {
        input.clearValue();
        input.readInput((err, value) => {
            if (value) {
                this.onPasswordInput(value);
            }
        });
    }

    onPasswordInput(password: string) {
        if (!this.password) {
            this.password = password;
        }
        else {
            this.tries.push(password);
            this.totalGuesses++;
            if (password === this.password) {
                this.correctGuesses++;
            }
        }

        this.setContent();
    }
}

new Program();
