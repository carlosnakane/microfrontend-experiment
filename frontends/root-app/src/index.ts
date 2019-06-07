import './root-menu';
import { RootMenuRouteClickEvent } from './root-menu';
import { getCurrentRoute, initialize as initializeRouter, subscribe, navigate } from './router';
import { routesMock } from './mock';
import AppLifecycle from './app-lifecycle';

const rootMenu = document.createElement('root-menu');
const baseHref = document.createElement('base');
let appLife: AppLifecycle;

const initialize = () => {
  window.removeEventListener('DOMContentLoaded', blank);

  appLife = new AppLifecycle(document);

  initializeRouter();
  subscribe(changeApp);

  rootMenu.addEventListener('routeClick', (e: Event) => navigate((e as CustomEvent<RootMenuRouteClickEvent>).detail));
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

const blank = () => {
  rootMenu.setAttribute('active', '/');
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

  const loadAppResult = await appLife.loadApp(location.origin, newApp);

  if (loadAppResult.result === 'error') {
    console.log(loadAppResult.message);
    return;
  }

  rootMenu.setAttribute('active', newRoute);
}

const getAppNameByRoute = (route: string) => {
  if (route == null) {
    return null;
  }
  const app = routesMock.find(r => route.startsWith(r.path));
  return app == null ? null : app.name;
}

window.addEventListener('DOMContentLoaded', initialize);