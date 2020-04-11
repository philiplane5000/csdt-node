require("dotenv").config();
const inquirer = require("inquirer");
const { exec } = require("child_process");

const options = {};

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
  ])
  .then((selection) => {
    options.command = selection.command;
    inquirer
      .prompt([
        {
          message: "Type of Resource/(s):",
          type: "list",
          name: "resource",
          choices: [
            "Template",
            "CSElement",
            "SiteEntry",
            "WCS_Controller",
            new inquirer.Separator(),
            "PageDefinition",
            "PageAttribute",
            new inquirer.Separator(),
            "GIA_D",
            "GIA_A",
          ],
        },
      ])
      .then((selection) => {
        options.resource = selection.resource;
        inquirer
          .prompt([
            {
              message: "CID || fw-uid || '*'",
              type: "input",
              name: "id",
            },
          ])
          .then((selection) => {
            options.id = selection.id;
            // ****************************************************************//
            // run the csdt process passing users selections via options object
            // ****************************************************************//
            runCSDT(options);
            // ****************************************************************//
          });
      });
  })
  .catch((err) => {
    console.log("something went wrong");
    console.log(err);
  });


function runCSDT(options) {
  exec(
    `${process.env.JAVA_PATH_WINDOWS} -Dfile.encoding=UTF-8 -Xbootclasspath/a:lib/servlet-api.jar -jar developer-tools-command-line-12.2.1.2.0.jar http://${process.env.WCS_ENV}:80/sites/ContentServer username=${process.env.WCS_USERNAME} password=${process.env.WCS_PASSWORD} resources=${options.resource}:${options.id} cmd=${options.command} datastore=${process.env.WCS_DATASTORE}`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: \n${stdout}`);
    }
  );
}


