import { IAppManifest } from "./i-app-manifest";
import { IAppLifecycle } from "./i-app-lifecyle";

type LoadingResult = {
  result: 'success' | 'partial' | 'error',
  message?: string
}

let currentAppRootElement: ChildNode = null;
const currentAppAssetElements: (HTMLScriptElement | HTMLLinkElement)[] = [];

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
    currentAppAssetElements.push(element);
    return new Promise<LoadingResult>((resolve, reject) => {
      element.addEventListener('error', () => { reject({ result: 'error', message: `Can not load ${url}` } as LoadingResult) });
      element.addEventListener('load', () => resolve({
        result: 'success'
      } as LoadingResult));
    });
  }

  if (url.endsWith('.css')) {
    element = document.createElement("link");
    element.href = url;
    element.rel = 'stylesheet'
    document.getElementsByTagName("head")[0].appendChild(element);
    currentAppAssetElements.push(element);
    // TODO: There is no a right way to figure out if css files were loaded. Looking for workarounds...
    return Promise.resolve({
      result: 'success'
    } as LoadingResult);
  }
  return Promise.reject({ result: 'error', message: `Unexpected file type: ${url}` } as LoadingResult);
}

const unloadCurrentApp = async (): Promise<void> => {
  const appLifecycle = window['lifecycle'] as IAppLifecycle;
  if (appLifecycle != null) {
    // @ts-ignore
    if (typeof appLifecycle.unmount.then === 'function') {
      await appLifecycle.unmount();
    } else {
      appLifecycle.unmount();
    }
    window['lifecycle'] = null;
    if (currentAppRootElement !== null) {
      if (document.body.contains(currentAppRootElement)) {
        document.body.removeChild(currentAppRootElement);
      }
    }

    currentAppAssetElements.forEach(e => document.head.removeChild(e));
    currentAppAssetElements.length = 0;

  }

  Promise.resolve();
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

  await unloadCurrentApp();

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

  const baseElement = document.getElementsByTagName('base')[0];
  baseElement.setAttribute('href', `/${appName}/`);

  currentAppRootElement = appRootElement[0];
  document.getElementsByTagName("body")[0].appendChild(currentAppRootElement);

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
