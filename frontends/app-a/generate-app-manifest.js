const path = require('path');
const fs = require('fs');
const CRAAssetManifest = require(path.resolve(__dirname, './build/asset-manifest.json'));

const assets = Object.keys(CRAAssetManifest.files)
  .filter(name => name.endsWith('.js') || name.endsWith('.css'))
  .filter(name => name !== 'service-worker.js')
  .filter(name => name !== 'main.js')
  .filter(name => !name.match(/^precache-manifest\.[\w\d]+\.js$/))
  .map(name => CRAAssetManifest.files[name]);

const appManifest = {
	"entrypoint": CRAAssetManifest.files['main.js'],
	"components": [
		"component-a"
	],
	"assets": assets
};

fs.writeFile (path.resolve(__dirname, "./build/app-manifest.json"), JSON.stringify(appManifest), function(err) {
    if (err) {
      throw err;
    }
    console.log('app-manifest.json written');
  }
);
