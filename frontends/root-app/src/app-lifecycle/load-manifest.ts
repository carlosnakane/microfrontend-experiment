import { IAppManifest } from './i-app-manifest';


const loadManifest = async (appUrl: string): Promise<IAppManifest | null> => {
  const manifest = await fetch(`${appUrl}/app-manifest.json`);
  if (manifest.status === 200) {
    try {
      return await manifest.json();
    } catch (e) {
      return null;
    }
  }

  return null;
};

export default loadManifest;
