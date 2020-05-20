## CSDT-NODE
- Content Server Development Tools for Node.js

#### About
Oracle provides the Content Server Development Tools (CSDT) to provide WebCenter Sites developers the ability to import and export assets from one environment to another, such as from DEV to UAT, etc. The CSDT package that ships with your WCS installation includes both a CLI as well as an eclipse plug-in. The CLI being the tool for which CSDT-NODE is developed, namely, to help WCS developers easily construct and excecute import or export commands and then log the output/metadat associated with those operations when they have completed. Provided you have unpackaged the CSDT tools and extracted `developer-tools-command-line.x.y.z` to the root of this repository, included the neccessary Java EE libraries (see list below) into a root directory `/lib` running the command `node csdt` will take you through a series of prompts to construct the appropriate CSDT CLI command, execute the command and log the output.

#### Installation
1) Unzip the `developer-tools-command-line-x.y.z.zip` file, which is located in the clients folder in your WebCenter Sites installation directory (${Oracle Home}/wcsites/clients) Move the jar file into the root of this application and assign the full jar file name to `PATH_DEV_TOOLS_COMMAND_LINE_JAR` in a local `.env` file.
2) Create `.env` file in the root of this application and assign all applicable `.env` values referencing the example below. *IMPORTANT:* The WCS user must be a member of the `RESTADMIN` group.
2) Create a `/lib` directory locally and copy all the neccessary Java EE libraries into it.
3) *OPTIONAL* Create a `/csv` directory if you plan to use the `Read CSV` feature to run batch commands on groups of assets.
4) Ensure all system requirements are fulfilled. If you already have `Java SE Development Kit 8` installed, ensure the `PATH_JDK_8` (in your local `.env` file) is pointing to the absolute path of the java binary, for example on WINDOWS: `C:\Java\\jdk1.8.0_211\\bin\\java` - currently the tool is only compatible with this version of the JDK.
5) Run command `node csdt.js` and the app will walk you through executing your first `import || export || listds || listcs` command! 

#### Commands Summary
Import | Export | Listds | Listcs
* `export` => pull assets from WCS instance into datastore
* `import` => push assets to WCS instance from datastore
* `listds` => list assets specified in datastore
* `listcs` => list assets specified in content store

#### .env (eg)
* PATH_JDK_8=C:\Java\\jdk1.8.0_211\\bin\\java
* PATH_DEV_TOOLS_COMMAND_LINE_JAR=developer-tools-command-line.jar
* WCS_USERNAME=fwadmin (Must be a member of the RestAdmin group)
* WCS_PASSWORD=xceladmin (Must be a member of the RestAdmin group)
* WCS_ENV=wcs-uat
* WCS_DATASTORE=cs_workspace (The default workspace if you don't specify otherwise)

#### System Requirements
* Node.js >= v10.15.0
* Java SE Development Kit 8 (v1.8.0_211)
* developer-tools-command-line.jar (csdt-cli)
* /lib => 
  - cas-client-core.jar
  - commons-io.jar
  - commons-logging.jar
  - httpcore.jar
  - servlet-api.jar
  - sites-security.jar
  - sites-sso-cas-impl.jar
  - spring-beans.jar
  - commons-codec.jar
  - commons-lang3.jar
  - httpclient.jar
  - httpmime.jar
  - sites-core.jar
  - sites-sso-api.jar
  - sites-sso-oam-impl.jar
  - spring-core.jar

#### Other Guides & Resources
- [ORACLE-DOCS](https://docs.oracle.com/middleware/12211/wcs/develop/GUID-D80810CF-4CA1-4CE6-8533-571F6F65462C.htm#WBCSD995)
- [LINK](https://kksays.wordpress.com/2015/03/20/export-using-csdt-command-line-tool-in-oracle-webcenter-sites-fatwire/)
- [LINK](https://manifesto.co.uk/getting-started-content-server-developer-tools/)
