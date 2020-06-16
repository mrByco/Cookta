import {Component, Input, OnInit} from '@angular/core';
import {Food} from '../../../shared/models/grocery/food.model';
import {Router} from '@angular/router';
import {IdentityService} from '../../../shared/services/identity.service';

@Component({
  selector: 'app-food-item',
  templateUrl: './food-item.component.html',
  styleUrls: ['./food-item.component.css']
})
export class FoodItemComponent implements OnInit {

  @Input() Food: Food;

  @Input('Height') public Height: number = 365;
  @Input('Width') public Width: number = 320;
  @Input('HorMargin') public HorMargin: number = 3;
  @Input('VertMargin') public VertMargin: number = 8;

  constructor(public router: Router,
              public identityService: IdentityService) {
  }

  ngOnInit() {
  }

  async OnCardClick() {
    console.log('click');
    console.log(this.Food.foodId);
    await this.router.navigate(['/foods', this.Food.foodId]);
  }
}
