import { ILoadingResult } from "./i-loading-result";
import { IAppManifest } from "./i-app-manifest";

interface ILifecycleMethods {
  mount: () => void;
  unmount: () => void | Promise<void>;
}

const lifecycleWindowKey = 'lifecycle';

class AppLifecycle {
  private rootElement: ChildNode | null = null;
  private tagElements: (HTMLScriptElement | HTMLLinkElement)[] = [];

  public constructor(
    private loadManifest: (appUrl: string) => Promise<IAppManifest | null>,
    private loadAsset: (url: string, document: Document) => Promise<ILoadingResult<HTMLScriptElement | HTMLLinkElement>>,
    private document: Document,
    private window: Window) { }

  public loadApp = async (baseUrl: string, appName: string): Promise<ILoadingResult<void>> => {

    await this.unloadCurrentApp();

    const appUrl = `${baseUrl}/${appName}`;
    const manifest = await this.loadManifest(appUrl);
    if (manifest == null) {
      return Promise.reject({ result: 'error', message: `There is no ${appName} or its manifest is invalid` });
    }

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

    let baseElement = this.document.getElementsByTagName('base')[0];
    if (baseElement == null) {
      baseElement = this.document.createElement('base');
      this.document.head.appendChild(baseElement);
    }
    baseElement.setAttribute('href', `/${appName}/`);

    this.rootElement = appRootElement[0];
    this.document.getElementsByTagName("body")[0].appendChild(this.rootElement);

    const loadEntrypoint = await this.loadAsset(`${appUrl}/${manifest.entrypoint}`, this.document);

    if (loadEntrypoint.result === 'error' || loadEntrypoint.payload == null) {
      return Promise.reject({ result: 'error', message: `Could not load ${appName}'s entrypoint` });
    }

    this.tagElements.push(loadEntrypoint.payload);

    const appLifecycle = this.window[lifecycleWindowKey] as ILifecycleMethods;

    if (appLifecycle != null && appLifecycle.mount != null) {
      appLifecycle.mount();
    }

    return Promise.resolve({ result: 'success' });

  }



  public unloadCurrentApp = async (): Promise<void> => {
    const appLifecycle = this.window[lifecycleWindowKey] as ILifecycleMethods;
    if (appLifecycle != null) {
      // @ts-ignore
      if (typeof appLifecycle.unmount.then === 'function') {
        await appLifecycle.unmount();
      } else {
        appLifecycle.unmount();
      }
      this.window[lifecycleWindowKey] = null;
    }

    if (this.rootElement != null && this.document.body.contains(this.rootElement)) {
      this.document.body.removeChild(this.rootElement);
    }
    this.tagElements.forEach(e => this.document.head.removeChild(e));
    this.tagElements.length = 0;

    const baseElement = this.document.getElementsByTagName('base')[0];
    if (baseElement != null) {
      baseElement.setAttribute('href', '/');
    }

    Promise.resolve();
  }

  private loadAppAssets = async (assetsUrl: string[]): Promise<ILoadingResult<void>> => {
    const assets: Promise<ILoadingResult<HTMLScriptElement | HTMLLinkElement>>[] = assetsUrl.map(assetUrl => this.loadAsset(assetUrl, this.document));
    const result = await Promise.all(assets);
    const errors = result.filter(item => !item).length;
    if (errors > 0) {
      return Promise.reject({ result: 'error', message: `${errors > 1 ? 'Some assets' : 'One asset'} could not be loaded` });
    }

    result.forEach(i => {
      // It would be better use result.filter(i => i.payload != null).map() typescript didn't like it;
      if (i.payload) {
        this.tagElements.push(i.payload);
      }
    });

    return Promise.resolve({ result: 'success' });
  }

}

export default AppLifecycle;
