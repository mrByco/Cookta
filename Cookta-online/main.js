const express = require('express');
const url = require('url');
const fetchUrl = require('fetch').fetchUrl;
const ForceHttps = require("./middleware/force-https.middleware");
require('dotenv').config()


const prodUrl = 'https://cookta.me';
const renderUrl = 'https://cooktaservices.azurewebsites.net/prerendered';


function generateUrl(request) {
    return url.format({
        host: prodUrl,
        pathname: request.originalUrl
    })
}

function detectBot(userAgent) {
    let test = new RegExp(/bot|crawler|spider|crawling|externalhit/, 'i');
    return test.test(userAgent);
}

function serveApp(server) {
    const public = __dirname + '/dist/cookta/browser';
    server.get('*.*', express.static(public, {maxAge: '1y'}));
    server.all('*', function (req, res) {
        res.status(200).sendFile(`/`, {root: public});
    });
}

function serveSitemap(server) {
    server.get('/sitemap.xml', (req, res) => {
        fetchUrl('https://cooktaservices.azurewebsites.net/sitemap.xml', (error, meta, body) => {
            res.set('content-type', 'application/xml');
            res.send(body);
        })
    });
}

function useBotDetector(server) {
    server.use((req, res, next) => {
        let isBot = detectBot(req.headers['user-agent']);
        const ignoreUrls = [
            '/favicon.ico',
            '/ads.txt',
            '/sitemap.xml'
        ]
        if (isBot && !ignoreUrls.includes(req.originalUrl)) {
            fetchUrl(`${renderUrl}${req.originalUrl}`, (error, meta, body) => {
                res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
                res.send(body.toString());
            });
        } else {
            next();
        }
    });
}

// The Express app is exported so that it can be used by serverless Functions.
function app() {
    const server = express();

    if (process.env.DEBUG != 'TRUE') server.use(ForceHttps);
    useBotDetector(server);
    serveSitemap(server);
    serveApp(server);

    return server;
}

function run() {
    const port = process.env.PORT || 4200;
    const server = app();
    server.listen(port, () => {
        console.log(`Node Express server listening on http://localhost:${port}`);
    });
}

run();

