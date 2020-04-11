const csvFilePath='csv/release.csv';
const csv = require('csvtojson/v1');

const parser = {

  getResourceStr: async () => {
    try {
      let resourcesStr = '';
      const resObj = await parser.getResourceObj();

      let resArr = Array.from(resObj);
      //
      for (key in resObj) {
        // key = assettype
        resourcesStr += `${key}:`;
        resObj[key].forEach((cid, i, arr) => {
          resourcesStr += (i !== arr.length -1) ? `${cid},` : `${cid};`
        })
      }
      return resourcesStr;
    } catch (err) {
      console.log(err);
    }
  },

  getResourceObj: async () => {
    try {
      let resourcesObj = new Object();
      const assets = await parser.parseCSV();
      let unique = new Set(assets.map(asset => asset.assettype ))

      for (const assettype of unique) {
        resourcesObj[assettype] = new Array();
      }

      for (const asset of assets) {
        resourcesObj[asset.assettype].push(asset.cid);
      }

      return resourcesObj;

    } catch (err) {
      console.log(err)
    }
  },

  parseCSV: () => {
    return new Promise((resolve, reject) => {
      let parsed = [];
      csv()
        .fromFile(csvFilePath)
        .on('json',(jsonObj)=>{
          parsed.push(jsonObj)
        })
        .on('done',(err)=>{
          if(!err) {
            resolve(parsed)
          }
          reject(err)
        })
    })
  }

}

module.exports = parser;

