import {Component, OnInit} from '@angular/core';
import {IngredientService} from "../shared/services/ingredient-service/ingredient.service";
import {TagService} from "../shared/services/tag.service";
import {ServerService} from "../shared/services/server.service";
import {UnitService} from "../shared/services/unit-service/unit.service";
import {IdentityService} from "../shared/services/identity.service";
import {AppComponent} from "../app.component";

interface ILoadTask {
    Name: string,
    AsyncFunction: () => Promise<any>;
}


@Component({
    selector: 'app-root-component',
    templateUrl: './root-component.component.html',
    styleUrls: ['./root-component.component.css']
})
export class RootComponentComponent implements OnInit {

    public static readonly HeaderSize = 70;

    get IsLoading(): boolean {
        return this.LoadingText != null && this.LoadingScreen;
    }

    public LoadingText = '';
    //It blocks the components that uses dependencies
    public LoadingScreen: boolean = true;

    public LoadTasks: ILoadTask[];


    constructor(private ingredientService: IngredientService,
                private tagService: TagService,
                private unitService: UnitService,
                private userService: IdentityService,
                private serverService: ServerService,
                private identityService: IdentityService) {

        console.log('Init app')
    }


    private async InitApplication() {
        for (let task of this.LoadTasks) {
            this.LoadingText = task.Name;
            await task.AsyncFunction();
        }
        this.LoadingText = null;
        AppComponent.instance.DisplayLoading = false;
    }

    async ngOnInit() {

        this.LoadTasks = [
            {Name: 'Csatlakozás a szerverhez', AsyncFunction: async () => {await this.serverService.CheckServerAvailable()}},
            {Name: 'Egységek betöltése', AsyncFunction: async () => await  this.unitService.LoadUnits()},
            {Name: 'Hozzávalók betöltése', AsyncFunction: async () => await this.ingredientService.LoadIngredients()},
            {Name: 'Cimkék betöltése', AsyncFunction: async () => await this.tagService.LoadTags()},
            {Name: 'Identitás indítása', AsyncFunction: async () => await this.identityService.LoadIdentity() }
        ];
        await this.InitApplication();
    }
}
