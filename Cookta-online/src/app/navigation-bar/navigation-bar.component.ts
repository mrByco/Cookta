import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IdentityService} from "../shared/services/identity.service";
import {FamilyService} from '../shared/services/family.service';
import * as ResizeDetector from 'element-resize-detector';

const CollapseWitdh = 1200;

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements AfterViewInit {

  public PictureUrl: string = "";
  public Email: string = '';

  public NavbarCollapsed: boolean = false;
  public NavbarOpen: boolean = false;

  public ShowIngredientEditor: boolean = false;
  public ShowRoleEditor: boolean = false;
  public ShowErrorList: boolean = false;
  public ShowDebugOptions: boolean = false;
  public ShowUserEditor: boolean = false;
  private resizeDetector: ResizeDetector;

  @ViewChild('NavRoot') public RootElement: ElementRef;

  constructor(public identityService: IdentityService,
              public familyService: FamilyService,) {
    this.updateState();
    this.identityService.OnIdentityChanged.subscribe((user) => {
      console.log(user);
      if (!user)
        return;
      this.updateState();
    });
  }

  private updateState() {
    this.PictureUrl = this.identityService?.Identity?.profilpic;
    console.log(this.PictureUrl);
    this.Email = this.identityService?.Identity?.email;
    this.identityService.HasPermission('debug-options').then(b => this.ShowDebugOptions = b);
    this.identityService.HasPermission('edit-ingredients').then(b => this.ShowIngredientEditor = b);
    this.identityService.HasPermission('manage-roles').then(b => this.ShowRoleEditor = b);
    this.identityService.HasPermission('manage-users').then(b => this.ShowUserEditor = b);
    this.identityService.HasPermission('read-reports').then(b => this.ShowErrorList = b);
  }

  ngAfterViewInit() {
    this.resizeDetector = ResizeDetector();
    this.resizeDetector.listenTo(this.RootElement.nativeElement, () => this.AppResized());
  }

  async login(){
    await this.identityService.Login();
    location.reload();
  }

  private AppResized() {
    let oldNav = this.NavbarCollapsed;
    this.NavbarCollapsed = this.RootElement.nativeElement.offsetWidth < CollapseWitdh;
    if (this.NavbarCollapsed != oldNav) this.NavbarOpen = false;
  }
}
