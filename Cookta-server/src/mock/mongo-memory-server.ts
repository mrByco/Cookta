import {MongoHelper} from '../helpers/mongo.helper';

const {MongoClient} = require('mongodb');
const {MongoMemoryServer} = require('mongodb-memory-server');

// Extend the default timeout so MongoDB binaries can download
jest.setTimeout(60000);


export class DBManager {
    private server;

    constructor() {
        this.server = new MongoMemoryServer();
    }

    async start() {
        const url = await this.server.getConnectionString();
        await MongoHelper.connect(url);
    }

    stop() {
        return MongoHelper.Client.close().then(() => {
            this.server.stop();
        });
    }

    async cleanup() {
        let collections = await MongoHelper.getCollections();
        return Promise.all(collections.map(c => c.drop()));
    }
}
