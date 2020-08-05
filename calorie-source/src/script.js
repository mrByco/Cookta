
const mongoDb = require('mongodb');
const MongoClient = mongoDb.MongoClient;

require('dotenv').config();

const WORK_DB = 'Kuktadb';
const TARGET_COLLECTION = 'Nutrients'


const startRow = 3;
const worksheetIndex = 0;
const mappings = require('./mappings');


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

    XLSX = require('js-xlsx');
    let workbook = await XLSX.readFile('source.xlsx');

    let nutrients = [];

    let sheet = workbook.Sheets[workbook.SheetNames[0]];

    let row = startRow;
    while (row < 100000) {
        let nutrient = {};
        let stop = false;
        for (field of Object.keys(mappings)){
            let value = sheet[mappings[field].field + row];
            if (!value){
                stop = true;
                break;
            }

            value = value.w;
            if (mappings[field].type === 'num') value = +value;
            nutrient[field] = value;
        }
        if (stop) break;
        nutrients.push(nutrient);
        row++;
    }

    console.log(`Readed ${nutrients.length} nutrients!`);

    await collection.insertMany(nutrients);

    console.log(`Nutriens uploaded!`);
})
