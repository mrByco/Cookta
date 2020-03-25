import {IngredientType} from '../models/grocery/ingredient-type.model';
import {Food} from "../models/grocery/food.model";
import {Routes} from "../routes";
import {ServerService} from "./server.service";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {delay} from "rxjs/operators";
import {Tag} from "../models/grocery/tag.model";

@Injectable()
export class TagService {

  public TagsAsync: Promise<Tag[]>;
  public Tags: Tag[];

  constructor(
    private serverService: ServerService,
    private http: HttpClient
  ) {
    this.TagsAsync = this.LoadTags().then(t => this.Tags = t);
  }

  public async LoadTags(): Promise<Tag[]>{

    return new Promise(async resolve => {

      let response = await this.http.get(this.serverService.GetBase() + Routes.Tag.GetAll);

      let tags: Tag[] = [];
      response.subscribe(data => {
        for (const d of (data as any)){
          tags.push(Tag.FromJson(d));
        }
        resolve(tags);
      }, error => {
        resolve([]);
      });
    });
  }

  public async GetTagAsync(id: string): Promise<Tag>{
    let tags = await this.TagsAsync;
    return tags.find(tag => tag.guid == id);
  }
  public GetTag(id: string): Tag{
    if (!this.TagsAsync) return new Tag('', 'NoTags', '', true);
    let tags = this.Tags;
    return tags.find(tag => tag.guid == id);
  }
}
