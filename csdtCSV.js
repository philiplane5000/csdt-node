require("dotenv").config();
const inquirer = require("inquirer");
const { exec } = require("child_process");
const parser = require('./utils/parser.js');

const options = {};

// parser.getResourceStr().then(str => {
//   console.log(str)
// })

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
        process.env.CSV_FILEPATH = `csv/${selection.filename}.csv`
        parser.getResourceStr().then(resString => {
          options.resources = resString;
          // ****************************************************************//
          // ****************************************************************//
          runCSDT(options)
          // ****************************************************************//
          // ****************************************************************//
        })
      })

  })

  function runCSDT(options) {

    console.log(`${process.env.JAVA_PATH_WINDOWS} -Dfile.encoding=UTF-8 -Xbootclasspath/a:lib/servlet-api.jar -jar developer-tools-command-line-12.2.1.2.0.jar http://${process.env.WCS_ENV}:80/sites/ContentServer username=${process.env.WCS_USERNAME} password=${process.env.WCS_PASSWORD} resources=${options.resources} cmd=${options.command} datastore=${process.env.WCS_DATASTORE}`)

    // exec(
    //   `${process.env.JAVA_PATH_WINDOWS} -Dfile.encoding=UTF-8 -Xbootclasspath/a:lib/servlet-api.jar -jar developer-tools-command-line-12.2.1.2.0.jar http://${process.env.WCS_ENV}:80/sites/ContentServer username=${process.env.WCS_USERNAME} password=${process.env.WCS_PASSWORD} resources=${options.resources} cmd=${options.command} datastore=${process.env.WCS_DATASTORE}`,
    //   (error, stdout, stderr) => {
    //     if (error) {
    //       console.log(`error: ${error.message}`);
    //       return;
    //     }
    //     if (stderr) {
    //       console.log(`stderr: ${stderr}`);
    //       return;
    //     }
    //     console.log(`stdout: \n${stdout}`);
    //   }
    // );
    
  }
