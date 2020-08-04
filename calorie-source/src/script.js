
const mongoDb = require('mongodb');
const MongoClient = mongoDb.MongoClient;

require('dotenv').config();

const WORK_DB = 'Kuktadb';
const TARGET_COLLECTION = 'Nutrients'


const startRow = 3;
const worksheetIndex = 0;
const mappings = {
    code: {type: 'num', field: 'A'},
    name: {type: 'str', field: 'B'},
    categoryCode: {type: 'num', field: 'C'},
    categoryDesc: {type: 'str', field: 'D'},
    kcal: {type: 'num', field: 'E'},
    protein: {type: 'num', field: 'F', unit: 'g'},
    carbohydrate: {type: 'num', field: 'G', unit: 'g'},
    sugarsTotal: {type: 'num', field: 'H', unit: 'g'},
    fiberTotalDietary: {type: 'num', field: 'I', unit: 'g'},
    totalFat: {type: 'num', field: 'J', unit: 'g'},
    fattyAcidsTotalSaturated: {type: 'num', field: 'K', unit: 'g'},
    fattyAcidsTotalMonounsaturated: {type: 'num', field: 'L', unit: 'g'},
    fattyAcidsTotalPolyunsaturated: {type: 'num', field: 'M', unit: 'g'},
    cholesterol: {type: 'num', field: 'N', unit: 'mg'},
    retinol: {type: 'num', field: 'O', unit: 'mcg'},
    //vitaminARAE: {type: 'num', field: 'P', unit: ''},
    caroteneAlpha: {type: 'num', field: 'Q', unit: 'mcg'},
    caroteneBeta: {type: 'num', field: 'R', unit: 'mcg'},
    cryptoxanthinBeta: {type: 'num', field: 'S', unit: 'mcg'},
    lycopene: {type: 'num', field: 'T', unit: 'mcg'},
    luteinZeaxanthin: {type: 'num', field: 'U', unit: 'mcg'},
    thiamin: {type: 'num', field: 'V', unit: 'mg'},
    riboflavin: {type: 'num', field: 'W', unit: 'mg'},
    niacin: {type: 'num', field: 'X', unit: 'mg'},
    vitaminB6: {type: 'num', field: 'Y', unit: 'mg'},
    folicAcid: {type: 'num', field: 'Z', unit: 'mcg'},
    folateFood: {type: 'num', field: 'AA', unit: 'mcg'},
    //folateDFE: {type: 'num', field: 'AB', unit: ''},
    folateTotal: {type: 'num', field: 'AC', unit: 'mcg'},
    cholineTotal: {type: 'num', field: 'AD', unit: 'mg'},
    vitaminB12: {type: 'num', field: 'AE', unit: 'mcg'},
    vitaminB12Added: {type: 'num', field: 'AF', unit: 'mcg'},
    vitaminC: {type: 'num', field: 'AG', unit: 'mg'},
    vitaminDD2D3: {type: 'num', field: 'AH', unit: 'mcg'},
    vitaminEAlphaTocopherol: {type: 'num', field: 'AI', unit: 'mg'},
    vitaminEAdded: {type: 'num', field: 'AJ', unit: 'mg'},
    vitaminKPhylloquinone: {type: 'num', field: 'AK', unit: 'mcg'},
    calcium: {type: 'num', field: 'AL', unit: 'mg'},
    phosphorus: {type: 'num', field: 'AM', unit: 'mg'},
    magnesium: {type: 'num', field: 'AN', unit: 'mg'},
    iron: {type: 'num', field: 'AO', unit: 'mg'},
    zinc: {type: 'num', field: 'AP', unit: 'mg'},
    copper: {type: 'num', field: 'AQ', unit: 'mg'},
    selenium: {type: 'num', field: 'AR', unit: 'mcg'},
    potassium: {type: 'num', field: 'AS', unit: 'mg'},
    podium: {type: 'num', field: 'AT', unit: 'mg'},
    caffeine: {type: 'num', field: 'AU', unit: 'mg'},
    theobromine: {type: 'num', field: 'AV', unit: 'mg'},
    alcohol: {type: 'num', field: 'AW', unit: 'g'},
}


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
