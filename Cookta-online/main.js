require('zone.js/dist/zone-node');
const express = require('express');
const fs = require('fs');
const url = require('url');
const fetch = require('node-fetch');
const join = require('path').join
const ForceHttps = require("./middleware/force-https.middleware");
require('dotenv').config()


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
function app() {
    const server = express();

    if (process.env.DEBUG === undefined){
        server.use(ForceHttps);
    }

    server.use((req, res, next) => {
        let isBot = detectBot(req.headers['User-Agent']);
        if (isBot) {

            const botUrl = generateUrl(req)

            fetch(`https://cooktaservices.azurewebsites.net/`).then(() => {
                console.log('fetch');
                fetch(`${renderUrl}/${botUrl}`)
                    .then(r => r.text())
                    .then(body => {
                        res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
                        res.set('Vary', 'User-Agent');

                        res.send(body.toString());
                    });
            });
        } else {
            next();
        }
    });

    const public = __dirname + '/dist/cookta/browser';

    server.use(express.static(public));


    server.get('/sitemap.xml', (req, res) => {
        fetch.fetchUrl('https://cooktaservices.azurewebsites.net/sitemap.xml', (error, meta, body) => {
            res.send(body);
        })
    });

    server.all('*', function (req, res) {
        res.status(200).sendFile(`/`, {root: public});
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

run();

