export interface IAppLifecycle {
  mount: () => void;
  unmount: () => void | Promise<void>;
}