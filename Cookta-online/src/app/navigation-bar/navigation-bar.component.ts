import {Component, OnInit} from '@angular/core';
import {IdentityService} from "../shared/services/identity.service";
import {FamilyService} from '../shared/services/family.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  public PictureUrl: string = "";

  public ShowIngredientEditor: boolean = false;
  public ShowRoleEditor: boolean = false;
  public ShowErrorList: boolean = false;
  public ShowDebugOptions: boolean = false;
  public ShowUserEditor: boolean = false;

  constructor(public identityService: IdentityService,
              public familyService: FamilyService) {
    this.identityService.OnIdentityChanged.subscribe((user) => {
      if (!user)
        return;
      this.updateState();
    });
    this.updateState();
  }

  private updateState() {
    this.PictureUrl = this.identityService?.Identity?.profilpic;
    this.identityService.HasPermission('debug-options').then(b => this.ShowDebugOptions = b);
    this.identityService.HasPermission('edit-ingredients').then(b => this.ShowIngredientEditor = b);
    this.identityService.HasPermission('manage-roles').then(b => this.ShowRoleEditor = b);
    this.identityService.HasPermission('manage-users').then(b => this.ShowUserEditor = b);
    this.identityService.HasPermission('read-reports').then(b => this.ShowErrorList = b);
  }

  ngOnInit() {

  }

  async login(){
    await this.identityService.Login();
    location.reload();
  }

}
