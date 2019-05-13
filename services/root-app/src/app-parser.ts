
let _appPath = '';

type ParseResult = {
  head: HTMLHeadElement,
  body: HTMLBodyElement
};

const parse = (htmlString: string, appPath: string): ParseResult => {
  _appPath = appPath;
  const domParser = new DOMParser();
  const dom = domParser.parseFromString(htmlString, 'text/html');
  fixElements(dom);

  const head = dom.getElementsByTagName('head');
  const body = dom.getElementsByTagName('body');

  return {
    head: head.length === 0 ? null : head[0],
    body: body.length === 0 ? null : body[0]
  }
}

const fixElements = (dom: Document) => {
  const links = dom.getElementsByTagName('link');
  for (let i = 0; i < links.length; i++) {
    fixAttributes(links[i]);
  }

  const scripts = dom.getElementsByTagName('script');
  for (let i = 0; i < scripts.length; i++) {
    fixAttributes(scripts[i]);
  }
}

const fixAttributes = (element: HTMLElement) => {
  const href = element.getAttribute('href');
  const src = element.getAttribute('src');
  if (href != null) {
    element.setAttribute('href', fixUrl(href));
  }
  if (src != null) {
    element.setAttribute('src', fixUrl(src));
  }
  return element;
}

const fixUrl = (url: string) => {
  return url;
  if (
    url.startsWith(_appPath)
    || url.startsWith(`.${_appPath}`)
    || url.startsWith('//')
    || url.startsWith('http:')
    || url.startsWith('https:')
  ) {
    return url;
  }
  if (url.startsWith('./')) {
    return `${_appPath}/${url.substring(2)}`;
  }
  if (url.startsWith('/')) {
    return `${_appPath}/${url.substring(1)}`;
  }
  return `${_appPath}/${url}`;
}

export default parse;