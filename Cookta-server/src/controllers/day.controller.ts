import {Controller, Get, Route, Tags} from "tsoa";

@Route("/day")
@Tags("Days")
export class DayController extends Controller {
    @Get('/{date}')
    public async GetDay(): Promise<any> {

    }

}
