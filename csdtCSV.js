require("dotenv").config();
const inquirer = require("inquirer");
const { exec } = require("child_process");
const parser = require('./utils/parser.js');

const options = {};

parser.getResourceStr().then(str => {
  console.log(str)
})
inquirer
  .prompt([
    {
      message: "Select a CSDT command:",
      type: "list",
      name: "command",
      choices: [
        "export",
        "import",
        new inquirer.Separator(),
        "listds",
        "listcs",
      ],
    },
  ]).then((selection) => {
    options.command = selection.command;
    inquirer
      .prompt([
        {
          message: "Enter CSV filename:",
          type: "input",
          name: "filename",
        },
      ])
      .then((selection) => {
        options.resources = parser.get
      })

  })
