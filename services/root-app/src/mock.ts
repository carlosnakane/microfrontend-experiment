const appsMock: {
  [key: string]: { label: string, name: string, path: string }
} = {
  'app-a': { label: 'App A', name: 'app-a', path: '/app-a' },
  'app-b': { label: 'App B', name: 'app-b', path: '/app-b' }
};

const routesMock = Object.keys(appsMock).map(key => appsMock[key]);

export { appsMock, routesMock };