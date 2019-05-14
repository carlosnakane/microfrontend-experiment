
type ParseResult = {
  head: HTMLHeadElement,
  body: HTMLBodyElement
};

const parse = (htmlString: string): ParseResult => {
  const domParser = new DOMParser();
  const dom = domParser.parseFromString(htmlString, 'text/html');

  const head = dom.getElementsByTagName('head');
  const body = dom.getElementsByTagName('body');

  return {
    head: head.length === 0 ? null : head[0],
    body: body.length === 0 ? null : body[0]
  }
}


export default parse;