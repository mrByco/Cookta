
const mongoDb = require('mongodb');
const MongoClient = mongoDb.MongoClient;

require('dotenv').config();

const WORK_DB = 'Kuktadb';
const TARGET_COLLECTION = 'Nutrients'


const startRow = 3;
const worksheetIndex = 0;
const mappings = require('mappings');


MongoClient.connect(process.env.MONGO_CONNECT).then(async client => {
    console.log('Connected to mongo');
    let db = client.db(WORK_DB);

    try {
        console.log('Drop existing collection');
        await db.dropCollection(TARGET_COLLECTION);
    }
    catch {
        console.log('Could not drop');
    }

    await db.createCollection(TARGET_COLLECTION);
    collection = db.collection(TARGET_COLLECTION);
    console.log('Collection recreated!');

    XLSX = require('xlsx');
    let workbook = XLSX.readFile('test.xlsx');



})
