import { IAppManifest } from '../../i-app-manifest';
import appManifestMock from './app-manifest.mock';

const loadManifest = async (_: string): Promise<IAppManifest | null> => {
  return Promise.resolve(appManifestMock);
};

export default loadManifest;
