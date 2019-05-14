const build = (head: HTMLHeadElement, body: HTMLBodyElement, prependToBody: HTMLElement) => {
  clean();
  drawHead(head);
  drawBody(body, prependToBody);
  runScripts();
}

const clean = () => {
  const body = document.getElementsByTagName('body');
  if (body.length !== 0) {
    body[0].parentElement.removeChild(body[0]);
  }

  const head = document.getElementsByTagName('head');
  if (head.length !== 0) {
    head[0].parentElement.removeChild(head[0]);
  }
}

const drawHead = (head: HTMLHeadElement) => {
  document.getElementsByTagName('html')[0].appendChild(head);
}

const drawBody = (body: HTMLBodyElement, prepend: HTMLElement) => {
  document.getElementsByTagName('html')[0].appendChild(body);
  body.prepend(prepend);
}

const runScripts = () => {
  const scripts = Array.prototype.slice.call(document.getElementsByTagName("script"));
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src != "") {
      let tag = document.createElement("script");
      tag.src = scripts[i].src;
      scripts[i].parentElement.removeChild(scripts[i]);
      document.getElementsByTagName("head")[0].appendChild(tag);
    }
    else {
      // TODO: Yes... Looking for something more safe
      eval(scripts[i].innerHTML);
    }
  }
}

export default build;
