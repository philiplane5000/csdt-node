## CSDT-NODE
- Content Server Development Tools for Node.js

## Commands
Import | Export | Listds | Listcs
* `export` => pull assets from WCS instance
* `import` => push assets to WCS instance
* `listds` => list data store
* `listcs` => list content store

## System Requirements
* Node.js >= v10.15.0
* Java 8 (v1.8.0_211)
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

## .env (eg)
* JAVA_PATH_WINDOWS=C:\Java\\jdk1.8.0_211\\bin\\java
* WCS_USERNAME=fwadmin
* WCS_PASSWORD=xceladmin
* WCS_ENV=wcs-qa
* WCS_DATASTORE=cs_workspace

## About Oracle CSDT
- [LINK](https://kksays.wordpress.com/2015/03/20/export-using-csdt-command-line-tool-in-oracle-webcenter-sites-fatwire/)
- [LINK](https://manifesto.co.uk/getting-started-content-server-developer-tools/)
- [ORACLE-DOCS](https://docs.oracle.com/middleware/12211/wcs/develop/GUID-D80810CF-4CA1-4CE6-8533-571F6F65462C.htm#WBCSD995)
