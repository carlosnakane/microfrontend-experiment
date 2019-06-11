import './root-menu';
import loadAsset from './app-lifecycle/load-asset';
import loadManifest from './app-lifecycle/load-manifest';

import { getCurrentRoute, initialize as initializeRouter, subscribe, navigate } from './router';
import AppLifecycle from './app-lifecycle/app-lifecycle';

const rootMenu = document.createElement('root-menu');
const baseHref = document.createElement('base');
const routesMock = [
  { label: 'App A', name: 'app-a', path: '/app-a' },
  { label: 'App B', name: 'app-b', path: '/app-b' }
];

let appLifecycle: AppLifecycle;

const blank = () => {
  rootMenu.setAttribute('active', '/');
}

const getAppNameByRoute = (route: string) => {
  if (route == null) {
    return null;
  }
  const app = routesMock.find(r => route.startsWith(r.path));
  return app == null ? null : app.name;
}

const changeApp = async (newRoute: string, oldRoute?: string) => {

  const newApp = getAppNameByRoute(newRoute);

  if (newApp == null) {
    console.log('Invalid route');
    return;
  }

  if (oldRoute != null && newApp === getAppNameByRoute(oldRoute)) {
    return;
  }

  const loadAppResult = await appLifecycle.loadApp(location.origin, newApp);

  if (loadAppResult.result === 'error') {
    console.log(loadAppResult.message);
    return;
  }

  rootMenu.setAttribute('active', newRoute);
}

const initialize = () => {
  window.removeEventListener('DOMContentLoaded', blank);

  appLifecycle = new AppLifecycle(loadManifest, loadAsset, document, window);

  initializeRouter();
  subscribe(changeApp);

  rootMenu.addEventListener('routeClick', (e: Event) => navigate((e as CustomEvent).detail));
  rootMenu.setAttribute('routes', JSON.stringify(routesMock));
  document.body.appendChild(rootMenu);

  baseHref.href = '/';
  document.head.appendChild(baseHref);

  const currentRoute = getCurrentRoute();
  if (currentRoute !== '/') {
    changeApp(currentRoute);
  } else {
    blank();
  }
}

window.addEventListener('DOMContentLoaded', initialize);