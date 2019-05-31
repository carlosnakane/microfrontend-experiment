import { enableProdMode, NgModuleRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

let mainModule: NgModuleRef<AppModule> = null;

const mount = () => {
  if (environment.production) {
    enableProdMode();
  }

  platformBrowserDynamic().bootstrapModule(AppModule)
    .then(m => mainModule = m)
    .catch(err => console.error(err));
}

const umount = () => {
  if (mainModule != null) {
    mainModule.destroy();
  }
}

window['lifecycle'] = {
  mount,
  umount
};