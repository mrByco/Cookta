import {IngredientType} from '../models/grocery/ingredient-type.model';
import {Food} from "../models/grocery/food.model";
import {Routes} from "../routes";
import {ServerService} from "./server.service";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {delay} from "rxjs/operators";
import {ITag} from "../models/grocery/tag.interface";

@Injectable()
export class TagService {

  public Tags: Promise<ITag[]>;

  constructor(
    private serverService: ServerService,
    private http: HttpClient
  ) {
    this.Tags = this.LoadTags();
  }

  public async LoadTags(): Promise<ITag[]>{

    return new Promise(async resolve => {

      let response = await this.http.get(this.serverService.GetBase() + Routes.Tag.GetAll);

      let tags: ITag[] = [];
      response.subscribe(data => {
        for (const d of (data as any)){
          tags.push(d);
        }
        resolve(tags);
      }, error => {
        resolve([]);
      });
    });
  }

  public async GetTag(id: string): Promise<ITag>{
    let tags = await this.Tags;

    return tags.find(tag => tag.guid == id);
  }

}
