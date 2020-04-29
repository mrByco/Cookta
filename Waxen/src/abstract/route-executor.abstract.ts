export abstract class ARouteExecutor<RQ, RS> {
    constructor (execute: (rq: RQ) => Promise<RS>){}
}