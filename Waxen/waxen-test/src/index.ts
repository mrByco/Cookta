import * as express from 'express';
import {RegisterRoutes} from "./routes/router";


const app = express();

RegisterRoutes(app);

app.listen(8080);
console.log('Listening on 8080')
