#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import shell from "shelljs";

const askQuestions = () => {
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
};

async function run() {
    const answers = await askQuestions();
    const { BRANCHES, MAIN_BRANCH } = answers;

    BRANCHES.split(" ").forEach((branch) => {
        if (!shell.which("git")) {
            shell.echo(
                "Sorry, this script requires git to be installed on your machine."
            );
            shell.exit(1);
        } else {
            shell.exec(`git switch ${branch}`);
            shell.exec(`git pull --rebase origin ${MAIN_BRANCH}`);
        }
    });

    console.log(chalk.white.bgGreen.bold(`Done!`));
}

run();
