import {MetricsService} from "./metrics.service";
import {MetricsRecord} from "./metrics-record.interface";
import { ObjectId } from 'mongodb';
import * as chai from 'chai';


describe("Metrics service", () => {
    require('../../extensions/date-extensions');
    describe("Merge metrics data", () => {
        it('should keep old data if no overriding data', function () {
            let record: MetricsRecord = {instance_id: 'test_1', data: [[], [5,4]], date_hour: "", stat_key: ""}
            let recordToMerge: MetricsRecord = {instance_id: 'test_1', data: [], date_hour: "", stat_key: ""}
            recordToMerge.data[1] = [];
            recordToMerge.data[1][2] = 2;
            recordToMerge.data[1][3] = 5;

            let result = MetricsService.MergeMetricsData(record, recordToMerge);

            chai.expect(result.data[1][2]).to.be.eql(2);
            chai.expect(result.data[1][1]).to.be.eql(4);
        });

        it('should not merge undefined, to override truthy value', function() {
            let record: MetricsRecord = {instance_id: 'test_1', data: [[], [5,4]], date_hour: "", stat_key: ""}
            let recordToMerge: MetricsRecord = {instance_id: 'test_1', data: [], date_hour: "", stat_key: ""}
            recordToMerge.data[1] = [];
            recordToMerge.data[1][1] = undefined;

            let result = MetricsService.MergeMetricsData(record, recordToMerge);

            chai.expect(result.data[1][1]).to.be.eql(4);
        });

        it('should add 0', function() {
            let record: MetricsRecord = {instance_id: 'test_1', data: [[], [5,4]], date_hour: "", stat_key: ""}
            let recordToMerge: MetricsRecord = {instance_id: 'test_1', data: [[], [5,4, 0]], date_hour: "", stat_key: ""}


            let result = MetricsService.MergeMetricsData(record, recordToMerge);


            chai.expect(result.data[1][2]).to.be.eql(0);
        });
    });
});
