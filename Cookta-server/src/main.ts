import * as http from "http";
import {app} from "./app";
import {MongoHelper} from "./helpers/mongo.helper";

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);
const MongoConnectionString = "mongodb+srv://Server:g4tAX29h@cluster0-9xrvq.mongodb.net/CoffeeDB";
server.listen(PORT);
server.on("listening", async () => {
    console.info('Listening on ' + PORT);
    try{
        await MongoHelper.connect(MongoConnectionString);
        console.info("Connected to Mongo!");
    }catch (err){
        console.error(err);
    }
});
