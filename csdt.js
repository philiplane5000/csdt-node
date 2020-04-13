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
          choices: ["Follow Prompts", "Read CSV"],
        },
      ])
      .then((selection) => {
        options.method = selection.method;
        if (selection.method.startsWith("Read")) processCSV(options);
        else processManual(options);
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
        message: "ASSET TYPE:",
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
          new inquirer.Separator(),
          "GIA_F",
          "GIA_PD",
          "GIA_Vocabulary",
          new inquirer.Separator(),
          "Dimension",
          "DimensionSet",
          new inquirer.Separator(),
          "GSTAttribute",
          "GSTDefinition",
          "GSTProperty",
          "GSTVirtualWebroot",
          new inquirer.Separator(),
          "SiteNavigation",
          new inquirer.Separator(),
          "@ALL_NONASSETS",
          "@ALL_ASSETS",
          "@SITE",
          "@ROLE",
          "@TREETAB",
          "@STARTMENU",
          "@ELEMENTCATALOG",
          "@SITECATALOG",
        ],
      },
    ])
    .then((selection) => {
      options.assetType = selection.assetType;
      inquirer
        .prompt([
          {
            message: "CHOOSE:",
            type: "list",
            name: "allOrOne",
            choices: [
              `a) Execute command '${options.command}' on '${options.assetType}:*'`,
              `b) Execute command '${options.command}' on '${options.assetType}:<${options.idType}>'`,
            ],
          },
        ])
        .then((selection) => {
          if (selection.allOrOne.startsWith("a)")) {
            options.id = "*";
            confirmCommand(options);
          } else {
            inquirer
              .prompt([
                {
                  message: `INPUT <${options.idType}>:`,
                  type: "input",
                  name: "id",
                },
              ])
              .then((selection) => {
                options.id = selection.id;
                confirmCommand(options);
              });
          }
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
      let filepath = "";
      if (!selection.filename.startsWith("csv/")) filepath += "csv/";
      filepath += selection.filename;
      if (!filepath.endsWith(".csv")) filepath += ".csv";
      /* *************************************** */
      process.env.CSV_FILEPATH = filepath;
      /* *************************************** */
      parser.getResourceStr().then((resString) => {
        options.resources = resString;
        confirmCommand(options);
      });
    });
}

function confirmCommand(options) {
  // introduce validation of 'fw-uid' for import and 'cid' for export||listds||listcs
  let cmd;
  if (options.method.startsWith("Read")) {
    cmd = `${(process.env.PATH_JAVA_8) ? process.env.PATH_JAVA_8 : 'java'}  -Dfile.encoding=UTF-8 -Xbootclasspath/a:lib/servlet-api.jar -jar ${process.env.PATH_DEV_TOOLS_COMMAND_LINE_JAR} http://${process.env.WCS_ENV}:80/sites/ContentServer username=${process.env.WCS_USERNAME} password=${process.env.WCS_PASSWORD} resources=${options.resources} cmd=${options.command} datastore=${process.env.WCS_DATASTORE}`;
  } else {
    cmd = `${(process.env.PATH_JAVA_8) ? process.env.PATH_JAVA_8 : 'java'} -Dfile.encoding=UTF-8 -Xbootclasspath/a:lib/servlet-api.jar -jar ${process.env.PATH_DEV_TOOLS_COMMAND_LINE_JAR} http://${process.env.WCS_ENV}:80/sites/ContentServer username=${process.env.WCS_USERNAME} password=${process.env.WCS_PASSWORD} resources=${options.assetType}:${options.id} cmd=${options.command} datastore=${process.env.WCS_DATASTORE}`;
  }

  inquirer
    .prompt([
      {
        message: `RUN CSDT COMMAND: \n"${cmd}"\n`,
        type: "confirm",
        name: "exe",
      },
    ])
    .then((selection) => {
      if (selection.exe) {
        runCSDT(cmd);
      } else {
        console.log("ABORT!");
      }
    });
}

function runCSDT(cmd) {
  console.log("************RESULTS:********************");
  exec(cmd, {maxBuffer: 1024 * 100 * 100}, (error, stdout, stderr) => {
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
