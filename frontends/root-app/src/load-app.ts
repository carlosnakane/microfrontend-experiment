import { IAppManifest } from "./i-app-manifest";
import { IAppLifecycle } from "./i-app-lifecyle";

type LoadingResult = {
  result: 'success' | 'partial' | 'error',
  message?: string
}

const loadManifest = async (appUrl: string): Promise<IAppManifest> => {
  const manifest = await fetch(`${appUrl}/app-manifest.json`);
  if (manifest.status === 200) {
    try {
      return await manifest.json();
    } catch (e) {
      return null;
    }
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
const unloadCurrentApp = () => {
  const appLifecycle = window['lifecycle'] as IAppLifecycle;
  if (appLifecycle != null) {
    appLifecycle.unmount();
    document.body.innerHTML = '';
  }
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

  const appRootElement = new DOMParser().parseFromString(manifest.rootnode, 'text/html').body.childNodes;

  if (appRootElement.length === 0) {
    Promise.reject({ result: 'error', message: `rootnode missing in ${appName} manifest` });
  }

  if (Array.isArray(manifest.assets) && manifest.assets.length > 0) {
    const assetsLoading = await loadAppAssets(manifest.assets.map(assetsUrl => `${appUrl}/${assetsUrl}`));
    if (assetsLoading.result === 'error') {
      return Promise.reject(assetsLoading);
    }
  }

  unloadCurrentApp();

  const baseElement = document.createElement('base');
  baseElement.setAttribute('href', `/${appName}/`);
  document.getElementsByTagName("head")[0].appendChild(baseElement);
  document.getElementsByTagName("body")[0].appendChild(appRootElement[0]);

  const loadEntrypoint = await loadAsset(`${appUrl}/${manifest.entrypoint}`);

  if (loadEntrypoint.result === 'error') {
    return Promise.reject({ result: 'error', message: `Could not load ${appName}'s entrypoint` });
  }

  const appLifecycle = window['lifecycle'] as IAppLifecycle;

  if (appLifecycle != null && appLifecycle.mount != null) {
    appLifecycle.mount();
  }

  return Promise.resolve({ result: 'success' });

}

export default loadApp;
