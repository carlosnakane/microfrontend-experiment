const path = require('path');
const fs = require('fs');


const writeManifest = (assets) => {

  const entrypointPattern = /main\.[\w\d]+\.js/;
  const entrypoint = assets.filter(file => entrypointPattern.exec(file) !== null)[0];
  const appManifest = {
    "rootnode": "<app-root></app-root>",
    "entrypoint": entrypoint,
    "components": [
      "component-a"
    ],
    "assets": assets.filter(file => file !== entrypoint)
  };

  fs.writeFile (path.resolve(__dirname, "./dist/app-manifest.json"), JSON.stringify(appManifest), function(err) {
      if (err) {
        throw err;
      }
      console.log('app-manifest.json written');
    }
  );
}

fs.readFile(path.resolve(__dirname, './dist/index.html'), (err, data) => {
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