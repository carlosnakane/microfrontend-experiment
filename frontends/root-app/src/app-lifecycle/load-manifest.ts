import { IAppManifest } from './i-app-manifest';

const manifestFileName = 'app-manifest.json';

const loadManifest = async (appUrl: string): Promise<IAppManifest | null> => {
  const manifest = await fetch(`${appUrl}/${manifestFileName}`);
  if (manifest != null && manifest.status === 200) {
    try {
      return await manifest.json();
    } catch (e) {
      return null;
    }
  }

  return null;
};

export { manifestFileName };

export default loadManifest;
