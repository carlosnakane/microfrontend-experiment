type SubscriberCallback = (newRoute?: string, oldRoute?: string) => {}
type RouteChangeEvent = { newRoute: string, oldRoute: string };

const _subscribers: SubscriberCallback[] = [];

let _currentRoute: string = null;

const initialize = () => {
  _currentRoute = location.pathname;
}

const getCurrentRoute = () => _currentRoute;

const navigate = (route: string) => {
  const appName = route.replace('/', '');
  history.pushState(null, null, appName);
  const oldRoute = _currentRoute;
  _currentRoute = route;
  const newRoute = _currentRoute;
  onRouteChange({
    newRoute: newRoute,
    oldRoute: oldRoute
  });
}

const subscribe = (callback: SubscriberCallback) => {
  _subscribers.push(callback);
}

const onRouteChange = (event: RouteChangeEvent) => {
  _subscribers.forEach(s => s(event.newRoute, event.oldRoute));
}

export { getCurrentRoute, initialize, navigate, subscribe };
