import * as http from "http";
import {app} from "./app";
import {MongoHelper} from "./helpers/mongo.helper";
import {Role} from "./models/role.model";
import {User} from "./models/user.model";
import {StorageService} from "./services/storage-service";
import {StorageSection} from "./models/storage-section.model";
import {Services} from "./Services";
import { StoreService } from "atomik/store-service/store-service";
import {ItemStore} from "atomik/store/item-store";
import {Service} from "@azure/storage-blob/typings/src/generated/src/operations";
import {FamilyService} from "./services/family-service";
import {UserService} from "./services/user-service";
import {Family} from "./models/family.model";
import {EssentialsService} from "./services/essentials-service";
import {EssentialList} from "./models/essential-list.model";

const PORT = process.env.PORT || 8080;

const ServiceManager = new ItemStore();
const server = http.createServer(app);
const MongoConnectionString = "mongodb+srv://cooktaservices:ZoIRbuJisN2fkePYO14D1itt7D0DImNQH6lmCpDgEEzfuO8iPd7So2VIPuSX9YccnoTUY6uMm4Tz15irHXTDYvKfg6I1cjlyVFR6EUXmhiktVTwMc6dclAeWSv2eFdtrZUYcHypxDc5Sf4CBo1Jb2l1F3ZVpetemn3Nag2kLmhNaJ2XEO23fkSeqwFjDjjgKmWeySnnpI5v0aO83vKb2xaueSSmHNMOxOnipe1JXrBnAOzmBz7J1XXZCCTaF3i4Q@kukta1-nfeff.azure.mongodb.net/Kuktadb";

server.on("listening", async () => {
    console.info('Listening on ' + PORT);
});

try{
    console.info("Connecting to Mongo...");
    MongoHelper.connect(MongoConnectionString).then(async () => {
        console.info("Initialize roles");
        await Role.init();

        console.log("Start atomik services...");

        let storageService = new StorageService((id, s) => {return new StorageSection(id, storageService)}, 'Stock');
        let familyService = new FamilyService((id, s) => {return new Family(id, storageService)}, 'Family');
        let userService = new UserService((id, s) => {return new User(id, storageService)}, 'Users');
        let essentialsService = new EssentialsService((id, s) => {return new EssentialList(id, storageService)}, 'Essentials');

        Services.StorageService = storageService;
        Services.FamilyService = familyService;
        Services.UserService = userService;
        Services.EssentialsService = essentialsService;
        await ServiceManager.AddService(storageService);
        await ServiceManager.AddService(familyService);
        await ServiceManager.AddService(userService);
        await ServiceManager.AddService(essentialsService);
        await ServiceManager.Start(MongoConnectionString);


        console.info("Starting server...");
        server.listen(PORT);

        /*
        let users = await User.GetAllUser();
        console.log(`${users.length} users loaded...`);
        for (let user of users){
            await user.RefreshDependenciesToPrimarySub();
            console.log(`User: ${user.username} - Refreshed!`);
        }*/
    });
}catch (err){
    console.error(err);
}

