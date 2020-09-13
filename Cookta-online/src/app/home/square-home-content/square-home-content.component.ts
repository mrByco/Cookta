import {Component, Input, OnInit} from '@angular/core';
import {ISquareContent} from "../../../../../Cookta-shared/src/models/home/square-conent.interface";
import {Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-square-home-content',
  templateUrl: './square-home-content.component.html',
  styleUrls: ['./square-home-content.component.css']
})
export class SquareHomeContentComponent implements OnInit {

  @Input("Data") public Content: ISquareContent;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  OpenCurrentActive(currentIndex: number) {
    this.router.navigate(['foods', this.Content.images[currentIndex].foodId]);
  }
}
