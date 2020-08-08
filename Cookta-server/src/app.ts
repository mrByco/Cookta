import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as router from './server/router';
import {requestLoggerMiddleware} from './middleware/request.logger.middleware';
import {ForceHTTPS} from './middleware/force-https.middleware';

const fileUpload = require('express-fileupload');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(requestLoggerMiddleware);
app.use(fileUpload(
    {
        useTempFiles: true,
        tempFileDir: '/tmp/',
        preserveExtension: true,
    }));
router.RegisterRoutes(app);



if (process.env.NODE_ENV == "debug"){
    console.warn('You are running the server in debug mode.')
    console.warn('Api will available over http.')
}else{
    app.use(ForceHTTPS);
}

app.get('/', (req, res) => {
    res.send('Hello friend! :)');
});


/*if (process.env.NODE_ENV == "debug ") {
    try {
        const swaggerDocument = require('../swagger.json');
        app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    } catch (err) {
        console.error(err);
    }
}*/


export {app};
