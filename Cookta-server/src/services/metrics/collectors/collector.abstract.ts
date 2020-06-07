import {MetricsService} from "../metrics.service";

export abstract class ACollector {
    constructor(public MetricsService: MetricsService){

    }
}