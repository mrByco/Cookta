import 'hammerjs';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";

if (environment.production) {
  enableProdMode();
}

export var NeedCheckPermission = false;
if (window.location.hostname.match('192\\.168\\.\\d{1,3}\\.\\d{1,3}')){
  console.log('Its local ip. Running in test mode');
  NeedCheckPermission = true;
}
else if (window.location.hostname.match('localhost')){
  console.log('Its localhost. Running in normal mode');
  NeedCheckPermission = true;
}
else if (window.location.hostname.match('test\\.cookta\\.online')) {
  console.log('Test cookta running test mode');
  NeedCheckPermission = true;
}
else if (window.location.hostname.match('cookta\\.online')){
    console.log('Prod cookta running normal mode');
    NeedCheckPermission = false;
}else {
  console.log('Not valid url redirect to cookta.online')
  window.location.href = 'https://cookta.online/';
}
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
