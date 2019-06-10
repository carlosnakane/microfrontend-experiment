import { ILoadingResult } from "../../i-loading-result";

const loadAsset = (url: string, document: Document): Promise<ILoadingResult<HTMLScriptElement | HTMLLinkElement>> => {
  if (url.endsWith('.js')) {
    const element = document.createElement("script");
    element.src = url;
    document.getElementsByTagName("head")[0].appendChild(element);
    return Promise.resolve({ result: 'success', payload: element });
  }

  if (url.endsWith('.css')) {
    const element = document.createElement("link");
    element.href = url;
    element.rel = 'stylesheet'
    document.getElementsByTagName("head")[0].appendChild(element);
    return Promise.resolve({ result: 'success', payload: element });
  }
  return Promise.reject({ result: 'error', message: `Unexpected file type: ${url}` });
}

export default loadAsset;
