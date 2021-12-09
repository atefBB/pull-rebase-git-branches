import inquirer from "inquirer";
import chalk from "chalk";
import shell from "shelljs";

function askQuestions() {
    const questions = [
        {
            name: "BRANCHES",
            type: "input",
            message: "What is the name of branches to rebase?",
        },
        {
            type: "input",
            name: "MAIN_BRANCH",
            message: "What is the main branch?",
        },
    ];

    return inquirer.prompt(questions);
}

function askForForcePush() {
    return inquirer.prompt({
        type: "list",
        name: "FORCE_PUSH",
        message:
            "You wanna force pushing? (Be careful! This action is dangerous!)",
        choices: ["Yes", "No"],
    });
}

async function run() {
    const { BRANCHES, MAIN_BRANCH } = (await askQuestions()) as any;

    if (!shell.which("git")) {
        shell.echo(
            "Sorry, this script requires git to be installed on your machine."
        );
        shell.exit(1);
    }

    BRANCHES.split(" ").forEach((branch: string) => {
        shell.exec(`git switch ${branch}`);
        shell.exec(`git pull --rebase origin ${MAIN_BRANCH}`);

        const { FORCE_PUSH } = askForForcePush() as any;

        if (FORCE_PUSH === "Yes") {
            shell.exec("git push --force");
        }
    });

    console.log(chalk.white.bgGreen.bold(`Done!`));
}

run();
