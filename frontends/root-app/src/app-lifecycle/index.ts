import { ILoadingResult } from "./i-loading-result";
import loadManifest from './load-manifest';
import loadAsset from './load-asset';

interface ILifecycleMethods {
  mount: () => void;
  unmount: () => void | Promise<void>;
}

const lifecycleWindowKey = 'lifecycle';

class AppLifecycle {
  private rootElement: ChildNode | null = null;
  private assetElements: (HTMLScriptElement | HTMLLinkElement)[] = [];

  public constructor(private document: Document, private window: Window) { }

  public loadApp = async (baseUrl: string, appName: string): Promise<ILoadingResult<void>> => {
    const appUrl = `${baseUrl}/${appName}`;
    const manifest = await loadManifest(appUrl);
    if (manifest == null) {
      return Promise.reject({ result: 'error', message: `There is no ${appName} or its manifest is invalid` });
    }

    await this.unloadCurrentApp();

    const appRootElement = new DOMParser().parseFromString(manifest.rootnode, 'text/html').body.childNodes;

    if (appRootElement.length === 0) {
      Promise.reject({ result: 'error', message: `rootnode missing in ${appName} manifest` });
    }

    if (Array.isArray(manifest.assets) && manifest.assets.length > 0) {
      const assetsLoading = await this.loadAppAssets(manifest.assets.map(assetsUrl => `${appUrl}/${assetsUrl}`));
      if (assetsLoading.result === 'error') {
        return Promise.reject(assetsLoading);
      }
    }

    const baseElement = this.document.getElementsByTagName('base')[0];
    baseElement.setAttribute('href', `/${appName}/`);

    this.rootElement = appRootElement[0];
    this.document.getElementsByTagName("body")[0].appendChild(this.rootElement);

    const loadEntrypoint = await loadAsset(`${appUrl}/${manifest.entrypoint}`, this.document);

    if (loadEntrypoint.result === 'error') {
      return Promise.reject({ result: 'error', message: `Could not load ${appName}'s entrypoint` });
    }

    const appLifecycle = this.window[lifecycleWindowKey] as ILifecycleMethods;

    if (appLifecycle != null && appLifecycle.mount != null) {
      appLifecycle.mount();
    }

    return Promise.resolve({ result: 'success' });

  }



  private unloadCurrentApp = async (): Promise<void> => {
    const appLifecycle = this.window[lifecycleWindowKey] as ILifecycleMethods;
    if (appLifecycle != null) {
      // @ts-ignore
      if (typeof appLifecycle.unmount.then === 'function') {
        await appLifecycle.unmount();
      } else {
        appLifecycle.unmount();
      }
      this.window[lifecycleWindowKey] = null;
      if (this.rootElement !== null) {
        if (this.document.body.contains(this.rootElement)) {
          this.document.body.removeChild(this.rootElement);
        }
      }

      this.assetElements.forEach(e => this.document.head.removeChild(e));
      this.assetElements.length = 0;

    }

    Promise.resolve();
  }

  private loadAppAssets = async (assetsUrl: string[]): Promise<ILoadingResult<void>> => {
    const assets: Promise<ILoadingResult<HTMLScriptElement | HTMLLinkElement>>[] = assetsUrl.map(assetUrl => loadAsset(assetUrl, this.document));
    const result = await Promise.all(assets);
    const errors = result.filter(item => !item).length;
    if (errors > 0) {
      return Promise.reject({ result: 'error', message: `${errors > 1 ? 'Some assets' : 'One asset'} could not be loaded` });
    }

    return Promise.resolve({ result: 'success' });
  }

}

export default AppLifecycle;
