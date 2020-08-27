import {ServerService} from './server.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Tag} from '../models/grocery/tag.model';
import {TagApi} from '../../../api/tags/tag.api';

@Injectable()
export class TagService {

  public TagsAsync: Promise<Tag[]>;
  public Tags: Tag[];

  private Api: TagApi = new TagApi();

  constructor(
    private serverService: ServerService,
    private http: HttpClient
  ) {
    //this.TagsAsync = this.LoadTags().then(t => this.Tags = t);
  }


  public async LoadTags(): Promise<Tag[]> {
    this.Tags = (await this.Api.GetAll(this.serverService.GetHttpCaller())).map(t => Tag.FromITag(t));
    return this.Tags;
  }

  public GetTag(id: string): Tag{
    return this.Tags.find(tag => tag.guid == id);
  }
}
