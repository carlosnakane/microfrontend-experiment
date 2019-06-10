import { ILoadingResult } from "./i-loading-result";

const loadAsset = (url: string, document: Document): Promise<ILoadingResult<HTMLScriptElement | HTMLLinkElement>> => {
  if (url.endsWith('.js')) {
    const element = document.createElement("script");
    element.src = url;
    document.getElementsByTagName("head")[0].appendChild(element);
    return new Promise<ILoadingResult<HTMLScriptElement>>((resolve, reject): void => {
      element.addEventListener('error', (): void => { reject({ result: 'error', message: `Can not load ${url}` }) });
      element.addEventListener('load', (): void => resolve({ result: 'success', payload: element }));
    });
  }

  if (url.endsWith('.css')) {
    const element = document.createElement("link");
    element.href = url;
    element.rel = 'stylesheet'
    document.getElementsByTagName("head")[0].appendChild(element);
    // TODO: There is no a right way to figure out if css files were loaded. Looking for workarounds...
    return Promise.resolve({ result: 'success', payload: element });
  }
  return Promise.reject({ result: 'error', message: `Unexpected file type: ${url}` });
}

export default loadAsset;
