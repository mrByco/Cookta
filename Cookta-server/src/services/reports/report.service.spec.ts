import {ReportService} from './report.service';
import {DBManager} from '../../mock/mongo-memory-server';
import {MongoHelper} from '../../helpers/mongo.helper';
import {Collection} from 'mongodb';
import {IStoreReport, ServerReport} from '../../models/report/report.model';


const dbman = new DBManager();


beforeAll(() => dbman.start());
afterAll(() => dbman.stop());
afterEach(() => dbman.cleanup());

describe('Report service', () => {
    let service: ReportService;
    let collection: Collection;


    beforeEach(async () => {
        collection = await MongoHelper.getCollection('Reports');
        service = new ReportService(collection);
    });

    describe('Report', () => {
        it('should write report to db', async function() {
            let report_inserted = await service.Report('test', 'auto', {data: {age: 16}});
            let item = await collection.find({}).toArray().then(a => a[0]) as IStoreReport;

            expect(ServerReport.FromStoreReport(item).ToReport()).toEqual(report_inserted);
        });

        it('should count the report if it is same', async function() {
            await service.Report('test', 'auto', {data: {age: 16}});
            let report_inserted2 = await service.Report('test', 'auto', {data: {age: 16}});

            expect(report_inserted2.count).toEqual(2);
        });

        it('should create different report if it is different', async function() {
            await service.Report('test', 'auto', {data: {age: 16}});
            await service.Report('test2', 'auto', {data: {age: 16}});
            await service.Report('test', 'auto2', {data: {age: 16}});
            await service.Report('test', 'auto', {data: {age: 17}});

            expect((await collection.find().toArray()).length).toEqual(4);
        });

    });

    describe('Read reports', () => {
        it('should read all inserted reports', async function() {
            //insert 2 reports
            let rep1 = await service.Report('test', 'auto', {data: {age: 16}});
            let rep2 = await service.Report('test2', 'auto', {data: {age: 16}});

            let reports = await service.GetAll();

            expect(reports).toEqual([rep1, rep2]);
        });
    });
});
