import './root-menu';
import { RootMenuRouteClickEvent } from './root-menu';
import { getCurrentRoute, initialize as initializeRouter, subscribe, navigate } from './router';
import domBuilder from './dom-builder';
import appParser from './app-parser';
import { appsMock, routesMock } from './mock';

const rootMenu = document.createElement('root-menu');
rootMenu.addEventListener('routeClick', (e: CustomEvent<RootMenuRouteClickEvent>) => navigate(e.detail));
rootMenu.setAttribute('routes', JSON.stringify(routesMock));

const initialize = () => {
  initializeRouter();
  subscribe(changeApp);
  const currentRoute = getCurrentRoute();
  if (currentRoute !== '/') {
    changeApp(currentRoute, null);
  } else {
    window.addEventListener('DOMContentLoaded', blank);
  }
}

const blank = () => {
  window.removeEventListener('DOMContenrLoaded', blank);
  document.body.appendChild(rootMenu);
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
  domBuilder(head, body, rootMenu);
}

const getAppNameByRoute = (route: string) => {
  if (route == null) {
    return null;
  }
  return route.split('/')[1];
}

initialize();