import {ServerService} from "../../shared/services/server.service";
import {Contracts} from "../../../../../Cookta-shared/src/contracts/contracts";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import { ISendableFood } from '../../../../../Cookta-shared/src/models/food/food-sendable.interface';


@Injectable()
export class SearchService {

    constructor(public serverService: ServerService, public router: Router){}

    public IsSearching: boolean;

    public get Results(): ISendableFood[]{
        return this.m_Results;
    }
    public get Text(): string {
        return this.m_Text;
    }
    private m_Results: ISendableFood[];
    private m_Text: string;

    public async Search(text: string): Promise<void>{
        this.IsSearching = true;
        this.m_Text = text;
        await this.router.navigate(['search', text])
        this.m_Results = (await this.execSearchRequest(text, 10)).results;
        this.IsSearching = false;
    }
    private async execSearchRequest(text: string, count: number): Promise<{results: ISendableFood[]}>{
        let request = await this.serverService.GetRequest(`/${Contracts.Foods.basepath}/search/${text}/${count}`);
        return new Promise(resolve => {
           request.subscribe(d => resolve(d)) ;
        });
    }
}
