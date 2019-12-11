import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from "body-parser";
import * as swaggerUi from 'swagger-ui-express';
import {RegisterRoutes} from "./routes";
import {requestLoggerMiddleware} from "./request.logger.middleware";
import './controllers/food.controller';
import './controllers/ingredient-type.controller';
import './controllers/unit.controller';
import './controllers/baselist.controller';
import './controllers/tag.controller';
import './controllers/stock.controller';
import './controllers/user.controller';
import './controllers/day.controller';
import './controllers/subscription.controller';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(requestLoggerMiddleware);
RegisterRoutes(app);

app.get('/', (req, res) => {
    res.send('Hello friend! :)');
});


if (process.env.NODE_ENV == "debug "){
    try{
        const swaggerDocument = require('../swagger.json');
        app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    } catch (err){
        console.error(err);
    }
}



export {app};
