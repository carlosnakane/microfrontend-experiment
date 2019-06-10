
export interface ILoadingResult<Payload> {
  result: 'success' | 'partial' | 'error';
  message?: string;
  payload?: Payload | null;
}
