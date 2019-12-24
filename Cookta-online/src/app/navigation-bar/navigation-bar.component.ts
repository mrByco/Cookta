import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {IdentityService} from "../shared/services/identity.service";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  constructor(private identityService: IdentityService) { }

  ngOnInit() {
  }

}
