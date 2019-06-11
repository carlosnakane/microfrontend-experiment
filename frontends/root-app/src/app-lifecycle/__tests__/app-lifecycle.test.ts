import AppLifecycle from '../index';
import loadAssetMock from './__mocks__/load-asset.mock';
import loadManifestMock from './__mocks__/load-manifest.mock';
import appManifestMock from './__mocks__/app-manifest.mock';

describe('', () => {

  const mockDocument = new DOMParser().parseFromString('<html><head></head><body></body</html>', 'text/html');
  // @ts-ignore
  const mockWindow: Window = {};
  const appLifecycle = new AppLifecycle(loadManifestMock, loadAssetMock, mockDocument, mockWindow);
  const appName = 'app-a';

  it('load an App', async () => {
    const result = await appLifecycle.loadApp('http://anywhere', appName);
    expect(result.result).toBe('success');
  });

  it(`change the base href to ${appName}`, () => {
    expect(mockDocument.head.getElementsByTagName('base')[0].href).toEqual(`/${appName}/`);
  });

  it('insert the assets script/link tags', () => {
    const totalScriptAssets = appManifestMock.assets.filter(fileName => fileName.endsWith('.js')).length;
    const totalMainScripts = 1;
    const totalScriptTags = totalScriptAssets + totalMainScripts;
    expect(mockDocument.head.getElementsByTagName('script').length).toBe(totalScriptTags);
    expect(mockDocument.head.getElementsByTagName('link').length).toBe(appManifestMock.assets.filter(fileName => fileName.endsWith('.css')).length);
  });

  it('insert the app root node', () => {
    expect(mockDocument.body.innerHTML).toContain(appManifestMock.rootnode);
  });

  it('unload the current app', async () => {
    await appLifecycle.unloadCurrentApp();
    expect(mockDocument.head.getElementsByTagName('script').length).toBe(0);
    expect(mockDocument.head.getElementsByTagName('link').length).toBe(0);
    expect(mockDocument.head.getElementsByTagName('base')[0].href).toEqual(`/`);
    expect(document.body.innerHTML).toEqual('');
  });

});