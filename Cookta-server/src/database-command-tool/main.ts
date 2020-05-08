import {MongoHelper} from "../helpers/mongo.helper";
import {ReadlineHelper} from "./readline.helper";
import {Role} from "../models/role.model";
import {CommandExecutor} from "./command-executor";


const Run = async () => {
    let loggedIn = false;
    while (!loggedIn) {
        let username = await ReadlineHelper.Question('Enter a mongo username.\n');
        let password = await ReadlineHelper.Question('Enter your mongo password.\n', true);
        const MongoConnectionString = `mongodb+srv://${username}:${password}@kukta1-nfeff.azure.mongodb.net/`;
        try {
            await MongoHelper.connect(MongoConnectionString);
            loggedIn = true;
        } catch {
            console.log('Bad password or username.. \n');
            loggedIn = false;
        }
    }
    console.log('Connected to mongo');
    await Role.init();
    console.log('Roles initialized');

    while (true) {
        let fullCommand = (await ReadlineHelper.Question("")).split(' ');
        let command = fullCommand[0];
        fullCommand.shift();
        let success = await CommandExecutor.ExecuteCommand(command, fullCommand);
        if (!success) {
            console.error('Command not exist!');
        }
    }
};
Run().then(() => {
    console.log('ByeBye')
});
