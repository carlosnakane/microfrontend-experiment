import './root-menu';
import { RootMenuRouteClickEvent } from './root-menu';
import { getCurrentRoute, initialize as initializeRouter, subscribe, navigate } from './router';
import { appsMock, routesMock } from './mock';
import loadApp from './load-app';


const rootMenu = document.createElement('root-menu');
const baseHref = document.createElement('base');

const initialize = () => {
  initializeRouter();
  subscribe(changeApp);

  rootMenu.addEventListener('routeClick', (e: CustomEvent<RootMenuRouteClickEvent>) => navigate(e.detail));
  rootMenu.setAttribute('routes', JSON.stringify(routesMock));
  document.body.appendChild(rootMenu);

  baseHref.href = '/';
  document.head.appendChild(baseHref);

  const currentRoute = getCurrentRoute();
  if (currentRoute !== '/') {
    changeApp(currentRoute, null);
  } else {
    blank();
  }
}

const blank = () => {
  window.removeEventListener('DOMContentLoaded', blank);
  rootMenu.setAttribute('active', '/');
}

const changeApp = async (newRoute: string, oldRoute: string) => {
  const newApp = getAppNameByRoute(newRoute);
  if (newApp === getAppNameByRoute(oldRoute)) {
    return;
  }
  const app = appsMock[newApp];
  if (app == null) {
    return;
  }

  const loadAppResult = await loadApp(location.origin, app.name);

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