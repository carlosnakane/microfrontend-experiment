type SubscriberCallback = (newRoute: string, oldRoute?: string) => {}
interface IRouteChangeEvent {
  newRoute: string;
  oldRoute: string;
}

const _subscribers: SubscriberCallback[] = [];

let _currentRoute = '';

const initialize = () => {
  _currentRoute = location.pathname;
}

const getCurrentRoute = () => _currentRoute;

const subscribe = (callback: SubscriberCallback) => {
  _subscribers.push(callback);
}

const onRouteChange = (event: IRouteChangeEvent) => {
  _subscribers.forEach(s => s(event.newRoute, event.oldRoute));
}


const navigate = (route: string) => {
  history.pushState(null, '', route);
  const oldRoute = _currentRoute;
  _currentRoute = route;
  const newRoute = _currentRoute;
  onRouteChange({
    newRoute: newRoute,
    oldRoute: oldRoute
  });
}

export { getCurrentRoute, initialize, navigate, subscribe };
