import { Component, OnInit } from '@angular/core';
import {Family} from '../../../shared/models/family.model';
import {FamilyService} from '../../../shared/services/family.service';

@Component({
  selector: 'app-family-management',
  templateUrl: './family-management.component.html',
  styleUrls: ['./family-management.component.css']
})
export class FamilyManagementComponent implements OnInit {

  constructor(private familyService: FamilyService) {
  }

  public CurrentFamily: Family;
  public Loading: boolean;


  ngOnInit() {
  }

  SelectFamily(family: Family) {
    this.CurrentFamily = family;
  }

  async CreateNewFamily() {
    this.Loading = true;

    let family = await this.familyService.CreateFamily('family-' + Math.floor(Math.random() * 100));
    this.CurrentFamily = family;
    this.Loading = false;
  }
}
