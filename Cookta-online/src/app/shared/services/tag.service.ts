import {ServerService} from './server.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Tag} from '../models/grocery/tag.model';
import {TagApi} from '../../../api/tags/tag.api';

@Injectable()
export class TagService {

  public TagsAsync: Promise<Tag[]>;
  public readonly Tags: Tag[] = [];

  private Api: TagApi = new TagApi();

  constructor(
    private serverService: ServerService
  ) {
    this.TagsAsync = this.LoadTags();
  }


  public async LoadTags(): Promise<Tag[]> {
    this.Tags.splice(0, this.Tags.length - 1);
    this.Tags.push(
        ...(await this.Api.GetAll(this.serverService.GetHttpCaller())).map(t => Tag.FromITag(t))
    );
    Tag.BuildReferences(this.Tags);
    return this.Tags;
  }

  public GetTag(id: string): Tag{
    return this.Tags.find(tag => tag.guid == id);
  }
}
