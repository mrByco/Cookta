import {MongoHelper} from '../helpers/mongo.helper';
import {Guid} from 'guid-typescript';
import {ITag} from 'cookta-shared/src/models/tag/tag.interface';

export class Tag implements ITag {
    private static m_cache: Tag[];
    private static readonly CollectionName: string = 'Tags';

    private static async GetCached(): Promise<Tag[]> {
        if (this.m_cache === undefined) {
            let collection = await MongoHelper.getCollection(this.CollectionName);
            let documents = await collection.find({}).toArray();
            this.m_cache = [];
            for (let doc of documents) {
                    this.m_cache.push(this.FromDocument(doc));
                }
                await this.RefreshChildStatus()
            }
            return this.m_cache;
    }

    constructor (
        public guid: string,
        public name: string,
        public parentId: string,
        public ischildonly: boolean
    ) {}

    public async Update(name?: string, parentId?: string): Promise<Tag>{
        if (name)
            this.name = name;
        let oldParent = this.parentId;
        if (await Tag.GetTagById(parentId))
            this.parentId = parentId;
        else
            this.parentId = null;
        await this.Save();
        if (oldParent)
            await Tag.RefreshChildStatus();
        else
            await Tag.RefreshChildStatusForSingleChanged(this);
        return this;
    }
    public async Delete(){
        (await Tag.GetCached()).splice((await Tag.GetCached()).findIndex(t => t === this));
        let collection = await MongoHelper.getCollection(Tag.CollectionName);
        await collection.deleteOne({guid: this.guid});
        await Tag.RefreshChildStatus();
    }

    public static async GetAll(): Promise<Tag[]> {
        return await Tag.GetCached();
    }
    public static async Add(name: string, parent: string): Promise<Tag> {
        let guid: string;
        while (!guid){
            guid = Guid.create().toString();
            if ((await Tag.GetCached()).find(t => t.guid == guid))
                guid = undefined;
        }
        let tag = new Tag(guid, name, parent, true);
        await tag.Save();
        if (tag.parentId)
            await this.RefreshChildStatusForSingleChanged(tag);
        return tag;
    }
    public static async GetTagById(guid: string): Promise<Tag> {
        let tags = await Tag.GetCached();
        return tags.find(t => t.guid === guid);
    }


    private ToDocument(): any{
        return {
            guid: this.guid,
            name: this.name,
            parent: this.parentId,
            ischildonly: this.ischildonly,
        }
    }
    private async Save(): Promise<boolean> {
        let collection = await MongoHelper.getCollection(Tag.CollectionName);
        let result = await collection.replaceOne({guid: this.guid}, this.ToDocument(), {upsert: true});
        if (!Tag.m_cache.includes(this))
            Tag.m_cache.push(this);
        return result.upsertedCount > 0;
    }

    private static FromDocument(document: any): Tag {
        return new Tag(
            document['guid'],
            document['name'],
            document['parent'],
            document['ischildonly']
        );
    }

    //It has to operate with the m_cached variable because the cached getter can call it;
    private static async RefreshChildStatus(){
        let childIds: string[] = [];
        this.m_cache.forEach(t => childIds.push(t.guid));

        for (let tag of this.m_cache){
            if (tag.parentId){
                let parent = this.m_cache.find(t => t.guid == tag.parentId);
                if (!parent){
                    tag.parentId = null;
                    await tag.Save();
                }else if (parent.ischildonly) {
                    parent.ischildonly = false;
                    await parent.Save();
                    childIds.splice(childIds.findIndex(t => t == parent.guid));
                } else {
                    childIds.splice(childIds.findIndex(t => t == parent.guid));
                }
            }
        }
        for (let id of childIds){
            let tag = this.m_cache.find(t => t.guid == id);
            if (!tag.ischildonly){
                tag.ischildonly = true;
                await tag.Save();
            }
        }
    }
    private static async RefreshChildStatusForSingleChanged(changed: Tag){
        let parent = await this.GetTagById(changed.parentId);
        if (parent.ischildonly){
            parent.ischildonly = false;
            await parent.Save();
        }
        return;
    }
}
