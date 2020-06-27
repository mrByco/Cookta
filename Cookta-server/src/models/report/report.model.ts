import * as mongoose from 'mongoose';
import {Document, Schema} from 'mongoose';

export interface IServerReport extends Document {
    report_type: string,
    source: string,
    desc: string,
    data: string
}


const ErrorSchema = new Schema({
    report_type: {type: String, required: true},
    source: {type: String, required: true},
    desc: {type: String, required: false},
    data: {type: Object, required: false, default: {}}
});
const model = mongoose.model<IServerReport>('Report', this.ErrorSchema, 'reports');
export default model;
