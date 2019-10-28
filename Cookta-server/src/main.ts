import * as http from "http";
import {app} from "./app";
import {MongoHelper} from "./helpers/mongo.helper";

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);
const MongoConnectionString = "mongodb+srv://cooktaservices:ZoIRbuJisN2fkePYO14D1itt7D0DImNQH6lmCpDgEEzfuO8iPd7So2VIPuSX9YccnoTUY6uMm4Tz15irHXTDYvKfg6I1cjlyVFR6EUXmhiktVTwMc6dclAeWSv2eFdtrZUYcHypxDc5Sf4CBo1Jb2l1F3ZVpetemn3Nag2kLmhNaJ2XEO23fkSeqwFjDjjgKmWeySnnpI5v0aO83vKb2xaueSSmHNMOxOnipe1JXrBnAOzmBz7J1XXZCCTaF3i4Q@kukta1-nfeff.azure.mongodb.net/Kuktadb";
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
