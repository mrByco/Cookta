import {Component, OnInit} from '@angular/core';
import {Meta, Title} from "@angular/platform-browser";

@Component({
  selector: 'app-how-to',
  templateUrl: './how-to.component.html',
  styleUrls: ['./how-to.component.css']
})
export class HowToComponent implements OnInit {

  constructor(private title: Title, private meta: Meta) {
    title.setTitle('Menütervezés, bevásárló lista, költségkövetés - Cookta');
    meta.addTags([
      {name: 'Költség'},
      {name: 'Felhasznállói útmutató'},
      {name: 'Főzés'},
      {name: 'Menütervezés'}
    ])
  }

  ngOnInit(): void {
  }

}
