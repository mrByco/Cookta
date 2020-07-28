import 'hammerjs';
import {enableProdMode} from '@angular/core';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";

if (environment.production) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
     platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
   });
