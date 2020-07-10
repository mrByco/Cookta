import {ReportService} from './report.service';
import {DBManager} from '../../mock/mongo-memory-server';
import {MongoHelper} from '../../helpers/mongo.helper';


const dbman = new DBManager();


beforeAll(() => dbman.start());
afterAll(() => dbman.stop());
afterEach(() => dbman.cleanup());

describe('Report service', () => {
    let service: ReportService;


    beforeEach(async () => {
        let coll = await MongoHelper.getCollection('Reports');
        service = new ReportService(coll);
    });

    describe('Report', () => {


        it('should write report to db', function() {

        });

    });

    describe('Read reports', () => {

    });
});
