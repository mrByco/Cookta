import {Controller, Get, Route, Tags} from "tsoa";

@Route("/ping")
@Tags('Ping')
export class PingController extends Controller {
    @Get('/')
    public async Ping(): Promise<string> {
        return 'OK';
    }
}
