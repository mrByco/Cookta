import * as http from 'http';
import {app} from './app';
import {MongoHelper} from './helpers/mongo.helper';
import {Role} from './models/role.model';
import {User} from './models/user.model';
import {StorageService} from './services/storage/storage-service';
import {StorageSection} from './models/storage-section.model';
import {Services} from './Services';
import {ItemStore} from 'atomik/lib/store/item-store';
import {FamilyService} from './services/family/family-service';
import {UserService} from './services/user/user-service';
import {Family} from './models/family.model';
import {EssentialsService} from './services/essentials/essentials-service';
import {EssentialSection} from './models/essentials/essential-list.model';
import {UnitService} from './services/unit/unit.service';
import {Unit} from './models/unit/unit.model';
import {IngredientTypeService} from './services/ingredient-types/ingredient-type.service';
import {IngredientType} from './models/ingredient-type/ingredient-type.model';
import {ShoppingListService} from './services/shopping-list/shopping-list.service';
import {BackupService} from './services/backup/bcakup-service';
import {RoleService} from './services/role/role-service';
import {FoodService} from './services/food/food.service';
import {LiveConnect} from './services/live-connection/live.connect';
import {MetricsService} from './services/metrics/metrics.service';
import {SetErrorHandler} from 'waxen/dist/server/request-promise-handler';
import {ReportService} from './services/reports/report.service';
import {NutrientService} from './services/nutrients/nutrient-service';

require('dotenv').config();

const startStarupTime = Date.now();

const PORT = process.env.PORT || 8080;

const ServiceManager = new ItemStore();
const server = http.createServer(app);
const MongoConnectionString = process.env.MONGO_CONNECT;


server.on("listening", async () => {
    console.info('Listening on ' + PORT);
});


try{
    console.info("Connecting to Mongo...");
    let atomicMongoStart = ServiceManager.Start(MongoConnectionString);
    MongoHelper.connect(MongoConnectionString).then(async () => {

        console.log("Start atomik services...");

        let liveConnect = new LiveConnect(server);

        Services.ReportService = new ReportService(await MongoHelper.getCollection('Reports'));
        SetErrorHandler((error) => {
            console.error(error);
            let stack = JSON.parse(JSON.stringify(error.stack));
            Services.ReportService.Report('server', 'auto', {stack: stack});
        });

        Services.MetricsService = new MetricsService(liveConnect, MongoHelper.Client);

        let storageService = new StorageService((id) => {return new StorageSection(id)}, 'Stock');

        let familyService = new FamilyService((id) => {return new Family(id)}, 'Family');

        let userService = new UserService((id) => {return new User(id)}, 'Users');

        let essentialsService = new EssentialsService((id) => {return new EssentialSection(id)}, 'Essentials');

        let unitService = new UnitService((id) => {return new Unit(id)}, 'Units');

        let roleService = new RoleService(id => new Role(id), 'Roles');

        let ingredientTypeService = new IngredientTypeService((id) => {return new IngredientType(id)}, 'Ingredients');

        let shoppingListService = new ShoppingListService(await MongoHelper.getCollection('ShoppingLists'));

        let foodService = new FoodService('Foods');

        Services.StorageService = storageService;
        Services.FamilyService = familyService;
        Services.UserService = userService;
        Services.EssentialsService = essentialsService;
        Services.UnitService = unitService;
        Services.RoleService = roleService;
        Services.IngredientTypeService = ingredientTypeService;
        Services.ShoppingListService = shoppingListService;
        Services.FoodService = foodService;
        Services.NutrientService = new NutrientService(await MongoHelper.getCollection('Nutrients'));

        await atomicMongoStart;
        await Promise.all([
            ServiceManager.AddService(storageService),
        ServiceManager.AddService(familyService),
        ServiceManager.AddService(userService),
        ServiceManager.AddService(essentialsService),
        ServiceManager.AddService(unitService),
        ServiceManager.AddService(roleService),
        ServiceManager.AddService(ingredientTypeService),
        ServiceManager.AddService(foodService),
        ]);


        console.info("Starting server...");
        server.listen(PORT);

        console.log(`Startup time: ${Date.now() - startStarupTime}ms`)

        if (process.env.NODE_ENV != "debug"){
            try {
                let backupService = new BackupService();
                backupService.Schedule();
                backupService.CreateBackup(MongoHelper.Client, 'Kuktadb').then(r => console.log('Backup created!'));
            }
            catch (err) {
                console.log('Creating backup was unsuccessful');
            }
        }

    });
}catch (err){
    console.error(err);
}

