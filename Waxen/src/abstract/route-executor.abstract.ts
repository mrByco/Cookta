export abstract class ARouteExecutor<RQ, RS, P> {
    constructor (execute: (rq: RQ, p: P) => Promise<RS>){}
}