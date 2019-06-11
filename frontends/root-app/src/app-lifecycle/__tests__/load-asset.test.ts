import loadAsset from '../load-asset';

const createDocument = () => {
  const documentString = '<html><head></head><body></body></html>';
  return new DOMParser().parseFromString(documentString, 'text/html');
};

describe('load-asset should...', () => {

  it('create a SCRIPT tag with correct properties inside the head tag', () => {
    const document = createDocument();
    const scriptSrc = 'http://nowhere/script.js';
    loadAsset(scriptSrc, document).then(res => {
      expect(res.result).toBe('success');
      expect(String(res.payload)).toBe('[object HTMLScriptElement]');
    }).catch(() => {
      expect.assertions(1);
    });

    const scriptTag = document.head.getElementsByTagName('script');
    scriptTag[0].dispatchEvent(new Event('load'));
    expect(scriptTag.length).toBe(1);
    expect(scriptTag[0].src).toBe(scriptSrc);
  });

  it('create a LINK tag with correct properties inside the head tag', () => {
    const document = createDocument();
    const linkHref = 'http://nowhere/styles.css';
    loadAsset(linkHref, document).then(res => {
      expect(res.result).toEqual('success');
      expect(res.payload).toHaveProperty('rel');
    });

    const linkTag = document.head.getElementsByTagName('link');
    expect(linkTag.length).toBe(1);
    expect(linkTag[0].rel).toBe('stylesheet');
    expect(linkTag[0].href).toBe(linkHref);
  });

  it('create nothing inside header tag due to an invalid file type', () => {
    const document = createDocument();
    const linkHref = 'http://nowhere/unknown.extension';
    loadAsset(linkHref, document)
      .catch(e => expect(e).toMatchObject({ result: 'error', message: `Unexpected file type: ${linkHref}` }))
  });


});