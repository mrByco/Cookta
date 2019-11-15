import {Body, Controller, Get, Put, Request, Route, Security, Tags} from "tsoa";
import {User} from "../models/user.model";
import {Day} from "../models/Days/day.model";

@Route("/day")
@Tags("Days")
export class DayController extends Controller {
    @Security('Bearer', [])
    @Get('/{date}')
    public async GetDay(@Request() request, date: string): Promise<Day> {
        try {
            let user = request.user as User;
            let day = await Day.GetDay(date, user);
            return day;
        } catch {
            this.setStatus(500);
            return;
        }
    }

    @Security('Bearer', [])
    @Put('/{date}')
    public async SetDay(@Request() request, date: string, @Body() mealings: IMealing[]): Promise<Day> {
        try {
            let user = request.user as User;
            let day = await Day.GetDay(date, user);
            await day.SetDay(mealings);
            return day;
        } catch {
            this.setStatus(500);
            return;
        }
    }

    @Security('Bearer', [])
    @Get('/{date}/{mealingIdentity}')
    public async RefreshDay(@Request() request, date: string, mealingIdentity: string): Promise<Day> {
        try {
            let user = request.user as User;
            let day = await Day.GetDay(date, user);
            await day.RefreshTagMealing(+mealingIdentity);
            return day;
        } catch {
            this.setStatus(500);
            return;
        }
    }

}
