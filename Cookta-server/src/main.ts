import * as http from "http";
import {app} from "./app";
import {MongoHelper} from "./helpers/mongo.helper";
import {Role} from "./models/role.model";
import {User} from "./models/user.model";
import {StorageService} from "./services/storage/storage-service";
import {StorageSection} from "./models/storage-section.model";
import {Services} from "./Services";
import {ItemStore} from "atomik/lib/store/item-store";
import {FamilyService} from "./services/family/family-service";
import {UserService} from "./services/user/user-service";
import {Family} from "./models/family.model";
import {EssentialsService} from "./services/essentials/essentials-service";
import {EssentialSection} from "./models/essentials/essential-list.model";
import {UnitService} from "./services/unit/unit.service";
import {Unit} from "./models/unit/unit.model";
import {IngredientTypeService} from "./services/ingredient-types/ingredient-type.service";
import {IngredientType} from "./models/ingredient-type/ingredient-type.model";
import {ShoppingListService} from "./services/shopping-list/shopping-list.service";
import {ShoppingList} from "./models/shopping-list.model";

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

        let storageService = new StorageService((id) => {return new StorageSection(id)}, 'Stock');

        let familyService = new FamilyService((id) => {return new Family(id)}, 'Family');

        let userService = new UserService((id) => {return new User(id)}, 'Users');

        let essentialsService = new EssentialsService((id) => {return new EssentialSection(id)}, 'Essentials');

        let unitService = new UnitService((id) => {return new Unit(id)}, 'Units');

        let ingredientTypeService = new IngredientTypeService((id) => {return new IngredientType(id)}, 'Ingredients');

        let shoppingListService = new ShoppingListService(id => new ShoppingList(id), 'ShoppingLists');

        Services.StorageService = storageService;
        Services.FamilyService = familyService;
        Services.UserService = userService;
        Services.EssentialsService = essentialsService;
        Services.UnitService = unitService;
        Services.IngredientTypeService = ingredientTypeService;
        Services.ShoppingListService = shoppingListService;
        await ServiceManager.AddService(storageService);
        await ServiceManager.AddService(familyService);
        await ServiceManager.AddService(userService);
        await ServiceManager.AddService(essentialsService);
        await ServiceManager.AddService(unitService);
        await ServiceManager.AddService(ingredientTypeService);
        await ServiceManager.AddService(shoppingListService);
        await ServiceManager.Start(MongoConnectionString);


        console.info("Starting server...");
        server.listen(PORT);
    });
}catch (err){
    console.error(err);
}

