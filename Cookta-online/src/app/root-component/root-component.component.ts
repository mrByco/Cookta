import {Component, OnInit} from '@angular/core';
import {IngredientService} from '../shared/services/ingredient-service/ingredient.service';
import {TagService} from '../shared/services/tag.service';
import {ServerService} from '../shared/services/server.service';
import {UnitService} from '../shared/services/unit-service/unit.service';
import {IdentityService} from '../shared/services/identity.service';
import {AppComponent} from '../app.component';
import {GenericTwoButtonDialogComponent} from '../utilities/generic-two-button-dialog/generic-two-button-dialog.component';
import {MDBModalService} from 'angular-bootstrap-md';
import {LiveConnectionService} from '../shared/services/live-connect.service/live-connection.service';
import {HomeService} from '../shared/services/home.service';
import {ActivatedRoute, Router} from "@angular/router";
import {UpdateService} from '../shared/services/update-service';

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
  public LoadingText = '';
  //It blocks the components that uses dependencies
  public LoadingScreen: boolean = true;
  public readonly LoadTasks: ILoadTask[] = [
    {Name: 'Csatlakozás a szerverhez', AsyncFunction: async () => await this.serverService.CheckServerAvailable()},
    {Name: 'Identitás indítása', AsyncFunction: async () => await this.identityService.LoadIdentity()},
    {Name: 'Egységek betöltése', AsyncFunction: async () => await this.unitService.LoadUnits()},
    {Name: 'Hozzávalók betöltése', AsyncFunction: async () => await this.ingredientService.LoadIngredients()},
    {Name: 'Cimkék betöltése', AsyncFunction: async () => await this.tagService.LoadTags()},
    {Name: 'Kezdőoldal előkészítése', AsyncFunction: async () => await this.homeService.RefreshStartPage()}
  ];

  constructor(private ingredientService: IngredientService,
              private tagService: TagService,
              private unitService: UnitService,
              private userService: IdentityService,
              private serverService: ServerService,
              private identityService: IdentityService,
              private modalService: MDBModalService,
              private liveService: LiveConnectionService,
              private homeService: HomeService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private updateService: UpdateService) {


    console.log('Init app');
  }

  get IsLoading(): boolean {
    return this.LoadingText != null && this.LoadingScreen;
  }

  async ngOnInit() {
    await new Promise(r => setTimeout(() => r(), 0));
    await this.InitApplication();
  }

  async RequireCheckTestPermission(): Promise<boolean> {


    if (!require('../app.component').AppComponent.instance.NeedCheckPermission) {
      return true;
    }

    return new Promise(async resolve => {
      if (!await this.identityService.LoggedIn) {
        this.ShowPleaseLoginForTestModal();
      } else {
        this.identityService.HasPermission('user-test').then((b) => {
          if (b) {
            resolve(b);
          } else {
            //Placeholder: we have no tester code system jet
            this.ShowNoPermissionModal();
            //this.ShowTesterDialog()
          }
        });
      }
    });
  }

  private async InitApplication() {
    let tasks = [];
    for (let task of this.LoadTasks) {
      this.LoadingText = task.Name;
      tasks.push(task.AsyncFunction());
    }
    await Promise.all(tasks);
    let task = new Promise((r) => setTimeout(() => r(), 500));
    this.LoadingText = null;
    AppComponent.instance.DisplayLoading = false;

  }

  private ShowNoPermissionModal() {
    let component = this.modalService.show(GenericTwoButtonDialogComponent);
    let dialog = component.content as GenericTwoButtonDialogComponent;
    dialog.Cancelable = false;
    dialog.Title = 'Privát tesztelés';
    dialog.Desc = 'Be vagy jelentkezve azonban az email-címedhez nem tartozik tesztelői jogosultság, ha meghívott vagy lépj kapcsolatba a meghívóddal. Fiókod email címe: ' + this.identityService.Identity.email + '\n Fiókváltáshoz először jelentkezz ki.';
    dialog.FailText = 'Kijelentkezés';
    dialog.OnFail.subscribe(() => this.identityService.Logout());
  }

  private ShowPleaseLoginForTestModal() {
    let component = this.modalService.show(GenericTwoButtonDialogComponent);
    let dialog = component.content as GenericTwoButtonDialogComponent;
    dialog.Cancelable = false;
    dialog.Title = 'Privát tesztelés';
    dialog.Desc = 'Nem vagy bejelentkezve, így nem tudtuk ellenőrizni hogy van e tesztelői jogosultságod. A belépéshez rendelkezned kell tesztelői fiókkal, amennyiben nem vagy tesztelő a bejelentkezés után sem fogsz tudni belépni.';
    dialog.SuccessText = 'Bejelentkezés';
    dialog.OnSuccess.subscribe(() => {
      console.log('Redirect to: ' + location.pathname);
      this.identityService.Login(location.pathname);
    });
  }

  private async ShowTesterDialog() {

    let component = this.modalService.show(GenericTwoButtonDialogComponent);
    let dialog = component.content as GenericTwoButtonDialogComponent;
    dialog.Cancelable = false;
    dialog.Title = 'Tesztelő';
    dialog.Desc = 'Úgy tűnik nincs tesztelői fiókod. Ha meghívott tesztelő vagy, a teszt-kódoddal aktiválhatod fiókodat.';
    dialog.SuccessText = 'Tovább a cookta.online-ra';
    dialog.OnSuccess.subscribe(() => {
      window.location.href = 'https://cookta.online/';
    });
    dialog.FailText = 'Kód használata';
    dialog.OnFail.subscribe(() => {
    });
  }
}
