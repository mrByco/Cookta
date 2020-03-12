import {Component, Input, OnInit} from '@angular/core';
import {Family} from '../../../shared/models/family.model';

@Component({
  selector: 'app-family-details-page',
  templateUrl: './family-details-page.component.html',
  styleUrls:
    ['./family-details-page.component.css',
      '../family-management/family-management.component.css']
})
export class FamilyDetailsPageComponent implements OnInit {
  @Input() CurrentFamily: Family;
  @Input() Loading: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  ShowAddMemberDialog() {

  }
}
