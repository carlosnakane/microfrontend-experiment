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
      expect(res.message).toEqual('success');
      expect(res.payload).toHaveProperty('src');
    }).catch(() => {
      console.log('Script tag error');
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

});