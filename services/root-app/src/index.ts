import './root-menu';
import { RootMenuRouteClickEvent } from './root-menu';
import { getCurrentRoute, initialize as initializeRouter, subscribe, navigate } from './router';
import appParser from './app-parser';

const appsMock: {
  [key: string]: { label: string, name: string, path: string }
} = {
  'app-a': { label: 'App A', name: 'app-a', path: '/app-a' },
  'app-b': { label: 'App B', name: 'app-b', path: '/app-b' }
};

const routesMock = Object.keys(appsMock).map(key => appsMock[key]);

const rootMenu = document.createElement('root-menu');
rootMenu.addEventListener('routeClick', (e: CustomEvent<RootMenuRouteClickEvent>) => navigate(e.detail));
rootMenu.setAttribute('routes', JSON.stringify(routesMock));

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

const draw = (head: HTMLHeadElement, body: HTMLBodyElement) => {
  clean();
  drawHead(head);
  drawBody(body);
  runScripts();
}

const drawHead = (head: HTMLHeadElement) => {
  document.getElementsByTagName('html')[0].appendChild(head);
}

const drawBody = (body: HTMLBodyElement) => {
  document.getElementsByTagName('html')[0].appendChild(body);
  body.prepend(rootMenu);
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
      eval(scripts[i].innerHTML);
    }
  }
}

const initialize = () => {
  initializeRouter();
  subscribe(changeApp);
  const currentRoute = getCurrentRoute();
  if (currentRoute !== '/') {
    changeApp(currentRoute, null);
  }
}

const changeApp = async (newRoute: string, oldRoute: string) => {
  const newApp = getAppNameByRoute(newRoute);
  if (newApp === getAppNameByRoute(oldRoute)) {
    return;
  }
  const appPath = appsMock[newApp];
  if (appPath == null) {
    return;
  }

  const response = await fetch(`index.html`);
  const html = await response.text();

  const { head, body } = appParser(html);
  draw(head, body);
}

const getAppNameByRoute = (route: string) => {
  if (route == null) {
    return null;
  }
  return route.split('/')[1];
}

initialize();