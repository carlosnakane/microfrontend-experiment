import { IAppManifest } from "./i-app-manifest";
import { IAppApi } from "./i-app-api";

type LoadingResult = {
  result: 'success' | 'partial' | 'error',
  message?: string
}

const loadManifest = async (appUrl: string): Promise<IAppManifest> => {
  const manifest = await fetch(`${appUrl}/app-manifest.json`);
  if (manifest.status === 200) {
    return await manifest.json();
  }

  return null;
};

const loadAsset = (url: string): Promise<LoadingResult> => {
  let element: HTMLScriptElement | HTMLLinkElement = null;
  if (url.endsWith('.js')) {
    element = document.createElement("script");
    element.src = url;
    document.getElementsByTagName("head")[0].appendChild(element);
  }
  if (url.endsWith('.css')) {
    element = document.createElement("link");
    element.href = url;
    document.getElementsByTagName("head")[0].appendChild(element);
  }

  if (element === null) {
    return Promise.reject({ result: 'error', message: `Unexpected file type: ${url}` } as LoadingResult);
  }

  return new Promise<LoadingResult>((resolve, reject) => {
    element.addEventListener('error', () => { reject({ result: 'error', message: `Can not load ${url}` } as LoadingResult) });
    element.addEventListener('load', () => resolve({
      result: 'success'
    } as LoadingResult));
  });
}

const loadAppAssets = async (assetsUrl: string[]): Promise<LoadingResult> => {
  const assets: Promise<LoadingResult>[] = assetsUrl.map(assetUrl => loadAsset(assetUrl));
  const result = await Promise.all(assets);
  const errors = result.filter(item => !item).length;
  if (errors > 0) {
    return Promise.reject({ result: 'error', message: `${errors > 1 ? 'Some assets' : 'One asset'} could not be loaded` } as LoadingResult);
  }

  return Promise.resolve({ result: 'success' });
}

const loadApp = async (baseUrl: string, appName: string): Promise<LoadingResult> => {
  const appUrl = `${baseUrl}/${appName}`;
  const manifest = await loadManifest(appUrl);
  if (manifest == null) {
    return Promise.reject({ result: 'error', message: `There is no ${appName} or its manifest is invalid` });
  }

  if (Array.isArray(manifest.assets) && manifest.assets.length > 0) {
    const assetsLoading = await loadAppAssets(manifest.assets.map(assetsUrl => `${appUrl}/${assetsUrl}`));
    if (assetsLoading.result === 'error') {
      return Promise.reject(assetsLoading);
    }
  }

  const module = (import(`${baseUrl}/${manifest.entrypoint}`) as Promise<IAppApi>);

  console.log(module);

  return Promise.reject();

}

export default loadApp;
