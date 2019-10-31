import {Body, Controller, Delete, Get, Post, Route, Tags} from "tsoa";
import {Tag} from "../models/tag.model";
import {SetTagRequest} from "../requests/set.tag.request";

@Route('/tag')
@Tags('Tag')
export class TagController extends Controller {
    @Get()
    public async GetAll(): Promise<Tag[]> {
        try{
            return await Tag.GetAll();
        }
        catch{
            this.setStatus(500);
        }
    }
    @Post()
    public async SetTag(@Body() request: SetTagRequest): Promise<Tag[]> {
        try{
            let tag;
            if (!request.guid){
                tag = await Tag.Add(request.name, request.parent);
            }else{
                tag = await Tag.GetTagById(request.guid);
                if (!tag) {
                    this.setStatus(404);
                    return;
                }
                tag = await tag.Update(request.name, request.parent);
            }
            return await Tag.GetAll();
        }
        catch{
            this.setStatus(500);
        }
    }
    @Delete('/{id}')
    public async Delete(id: string): Promise<Tag[]> {
        try{
            let tag = await Tag.GetTagById(id);
            if (!tag){
                this.setStatus(404);
                return;
            }
            await tag.Delete();
            return await Tag.GetAll();
        }
        catch{
            this.setStatus(500);
        }
    }

}
