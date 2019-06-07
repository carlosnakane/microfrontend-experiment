import { IAppManifest } from "./i-app-manifest";

type LoadingResult = {
  result: 'success' | 'partial' | 'error',
  message?: string
}

type LifecycleMethods = {
  mount: () => void,
  unmount: () => void | Promise<void>
}

class AppLifecycle {
  private rootElement: ChildNode | null = null;
  private assetElements: (HTMLScriptElement | HTMLLinkElement)[] = [];

  public constructor(private document: Document) { }

  public loadApp = async (baseUrl: string, appName: string): Promise<LoadingResult> => {
    const appUrl = `${baseUrl}/${appName}`;
    const manifest = await this.loadManifest(appUrl);
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

    const loadEntrypoint = await this.loadAsset(`${appUrl}/${manifest.entrypoint}`);

    if (loadEntrypoint.result === 'error') {
      return Promise.reject({ result: 'error', message: `Could not load ${appName}'s entrypoint` });
    }

    const appLifecycle = window['lifecycle'] as LifecycleMethods;

    if (appLifecycle != null && appLifecycle.mount != null) {
      appLifecycle.mount();
    }

    return Promise.resolve({ result: 'success' });

  }

  private loadManifest = async (appUrl: string): Promise<IAppManifest | null> => {
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

  private loadAsset = (url: string): Promise<LoadingResult> => {
    let element: HTMLScriptElement | HTMLLinkElement;

    if (url.endsWith('.js')) {
      element = this.document.createElement("script");
      element.src = url;
      this.document.getElementsByTagName("head")[0].appendChild(element);
      this.assetElements.push(element);
      return new Promise<LoadingResult>((resolve, reject) => {
        element.addEventListener('error', () => { reject({ result: 'error', message: `Can not load ${url}` } as LoadingResult) });
        element.addEventListener('load', () => resolve({
          result: 'success'
        } as LoadingResult));
      });
    }

    if (url.endsWith('.css')) {
      element = this.document.createElement("link");
      element.href = url;
      element.rel = 'stylesheet'
      this.document.getElementsByTagName("head")[0].appendChild(element);
      this.assetElements.push(element);
      // TODO: There is no a right way to figure out if css files were loaded. Looking for workarounds...
      return Promise.resolve({
        result: 'success'
      } as LoadingResult);
    }
    return Promise.reject({ result: 'error', message: `Unexpected file type: ${url}` } as LoadingResult);
  }

  private unloadCurrentApp = async (): Promise<void> => {
    const appLifecycle = window['lifecycle'] as LifecycleMethods;
    if (appLifecycle != null) {
      // @ts-ignore
      if (typeof appLifecycle.unmount.then === 'function') {
        await appLifecycle.unmount();
      } else {
        appLifecycle.unmount();
      }
      window['lifecycle'] = null;
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

  private loadAppAssets = async (assetsUrl: string[]): Promise<LoadingResult> => {
    const assets: Promise<LoadingResult>[] = assetsUrl.map(assetUrl => this.loadAsset(assetUrl));
    const result = await Promise.all(assets);
    const errors = result.filter(item => !item).length;
    if (errors > 0) {
      return Promise.reject({ result: 'error', message: `${errors > 1 ? 'Some assets' : 'One asset'} could not be loaded` } as LoadingResult);
    }

    return Promise.resolve({ result: 'success' });
  }

}

export default AppLifecycle;
