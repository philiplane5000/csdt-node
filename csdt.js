require("dotenv").config();
const inquirer = require("inquirer");
const { exec } = require("child_process");
const parser = require("./utils/parser.js");
const options = {};

inquirer
  .prompt([
    {
      message: "SELECT A CSDT COMMAND:",
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
          message: "METHOD:",
          type: "list",
          name: "method",
          choices: ["Manual Entry", "Process CSV"],
        },
      ])
      .then((selection) => {
        options.method = selection.method;
        if (selection.method === "Manual Entry") {
          processManual(options);
        } else {
          processCSV(options);
        }
      });
  })
  .catch((err) => {
    console.log("something went wrong");
    console.log(err);
  });

function processManual(options) {
  options.idType = options.command === "import" ? "fw-uid" : "cid";
  inquirer
    .prompt([
      {
        message: "Asset Type:",
        type: "list",
        name: "assetType",
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
      options.assetType = selection.assetType;
      inquirer
        .prompt([
          {
            message: `Enter: <${options.idType}> || '*'`,
            type: "input",
            name: "id",
          },
        ])
        .then((selection) => {
          options.id = selection.id;
          /*********************************************/
          console.log("\nexecuting csdt...\n");
          runCSDT(options);
          /*********************************************/
        });
    });
}

function processCSV(options) {
  console.log(`CSV process`);
  inquirer
    .prompt([
      {
        message: "Enter CSV filename:",
        type: "input",
        name: "filename",
      },
    ])
    .then((selection) => {
      // RegEx to remove/add .csv extension
      process.env.CSV_FILEPATH = `csv/${selection.filename}.csv`;
      parser.getResourceStr().then((resString) => {
        options.resources = resString;
        /*********************************************/
        console.log("\nexecuting csdt...\n");
        runCSDT(options);
        /*********************************************/
      });
    });
}

function runCSDT(options) {
  // introduce validation of 'fw-uid' for import and 'cid' for export||listds||listcs
  let cmd;
  if (options.method === "Manual Entry") {
    cmd = `${process.env.JAVA_PATH_WINDOWS} -Dfile.encoding=UTF-8 -Xbootclasspath/a:lib/servlet-api.jar -jar developer-tools-command-line-12.2.1.2.0.jar http://${process.env.WCS_ENV}:80/sites/ContentServer username=${process.env.WCS_USERNAME} password=${process.env.WCS_PASSWORD} resources=${options.assetType}:${options.id} cmd=${options.command} datastore=${process.env.WCS_DATASTORE}`;
  } else {
    cmd = `${process.env.JAVA_PATH_WINDOWS} -Dfile.encoding=UTF-8 -Xbootclasspath/a:lib/servlet-api.jar -jar developer-tools-command-line-12.2.1.2.0.jar http://${process.env.WCS_ENV}:80/sites/ContentServer username=${process.env.WCS_USERNAME} password=${process.env.WCS_PASSWORD} resources=${options.resources} cmd=${options.command} datastore=${process.env.WCS_DATASTORE}`;
  }

  console.log("************COMMAND:********************");
  console.log(cmd);
  console.log("****************************************\n");

  console.log("************RESULTS:********************");
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      console.log("****************************************\n");
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      console.log("****************************************\n");
      return;
    }
    if (stdout) {
      console.log(`stdout: \n${stdout}`);
      console.log("****************************************\n");
    }
  });
}
