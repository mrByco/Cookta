import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
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
  public ShowDebugOptions: boolean = false;

  constructor(public identityService: IdentityService,
              public familyService: FamilyService) {
    this.identityService.OnUserChanged.subscribe((user) => {
      if (!user)
        return;
      this.PictureUrl = user['picture'];

      identityService.HasPermission('edit-ingredients').then(b => this.ShowIngredientEditor = b);
      identityService.HasPermission('debug-options').then(b => this.ShowDebugOptions = b);
      console.log(user);
    });
  }

  ngOnInit() {

  }

}
