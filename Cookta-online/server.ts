import 'zone.js/dist/zone-node';

import {ngExpressEngine} from '@nguniversal/express-engine';
import * as express from 'express';
import {join} from 'path';

import {AppServerModule} from './src/main.server';
import {APP_BASE_HREF} from '@angular/common';
import {existsSync} from 'fs';
import * as url from 'url';
import * as fetch from 'fetch';


const prodUrl = 'https://cookta.me';
const renderUrl = 'https://render-tron.appspot.com/render';


function generateUrl(request) {
  return url.format({
    protocol: request.protocol,
    host: prodUrl,
    pathname: request.originalUrl
  })
}

function detectBot(userAgent) {
  let test = new RegExp('/bot|crawler|spider|crawling/i');
  return test.test(userAgent);
}

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/cookta/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  server.get('/sitemap.xml', (req, res) => {
    fetch.fetchUrl('https://cooktaservices.azurewebsites.net/sitemap.xml', (error, meta, body) => {
      res.send(body);
    })
  });

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {


    const isBot = detectBot(req.headers['User-Agent']);
    if (isBot){
      const botUrl = generateUrl(req);

      fetch(`https://cooktaservices.azurewebsites.net/`).then(() => {
        fetch(`${renderUrl}/${botUrl}`)
            .then(r => r.text())
            .then(body => {
              res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
              res.set('Vary', 'User-Agent');

              res.send(body.toString());
            });
      });
    }else{
      res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
    }
  });
  return server;
}

function run() {
  const port = process.env.PORT || 4200;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
