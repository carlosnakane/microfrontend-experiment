const path = require('path');
const fs = require('fs');


const writeManifest = (assets) => {

  const entrypoint = "main.js";
  const filteredAssets = assets.filter(file => file !== entrypoint);
  const appManifest = {
    "entrypoint": entrypoint,
    "components": [
      "component-a"
    ],
    "assets": filteredAssets
  };

  fs.writeFile (path.resolve(__dirname, "./dist/app-b/app-manifest.json"), JSON.stringify(appManifest), function(err) {
      if (err) {
        throw err;
      }
      console.log('app-manifest.json written');
    }
  );
}

fs.readFile(path.resolve(__dirname, './dist/app-b/index.html'), (err, data) => {
  if (err) {
    throw err; 
  }
  const html = data.toString();
  const pattern = /src="([\w\d-\.]+)"/g;
  const mtc = [];
  var matches;
  while ((matches = pattern.exec(html)) != null) {
    mtc.push(matches[1]);
  }

  writeManifest(mtc);

});