import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {IdentityService} from "../shared/services/identity.service";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  public PictureUrl: string = "";

  constructor(private identityService: IdentityService) {
    this.identityService.OnUserChanged.subscribe((user) => {
    if (!user)
      return;
    this.PictureUrl = user['picture'];
    console.log(user);
  });
  }

  ngOnInit() {

  }

}
